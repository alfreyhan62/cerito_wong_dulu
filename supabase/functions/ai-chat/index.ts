const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
}

const cache = new Map<string, { message: string; sources: Source[]; expiresAt: number }>()
const stopWords = new Set(['apa', 'yang', 'dan', 'atau', 'dari', 'untuk', 'dengan', 'dalam', 'cerita', 'rakyat', 'legenda', 'kisah', 'tentang', 'siapa', 'bagaimana', 'dimana', 'mana', 'pada', 'ini', 'itu', 'di'])
const systemInstruction = `Kamu adalah Cerito AI. Jawab hanya berdasarkan REFERENSI yang diberikan. Jangan gunakan pengetahuan di luar referensi atau mengarang fakta. Untuk tradisi lisan, nyatakan bahwa versi dapat berbeda bila referensi menyebutkannya. Jika referensi tidak cukup, jawab: "Informasi itu belum tersedia dalam koleksi sumber Cerito Wong Dulu." Jawab Bahasa Indonesia, ringkas, ramah, maksimal 180 token.`

type Reference = { title: string; category: string; region: string; summary?: string; moral?: string }
type Source = { title: string; url: string }
type KnowledgeDocument = { title: string; content: string; source_name: string; source_url: string; tags: string[] }

function words(value: string) {
  return new Set(value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g)?.filter((word) => word.length > 2 && !stopWords.has(word)) || [])
}

function validReference(value: unknown): value is Reference {
  if (!value || typeof value !== 'object') return false
  const reference = value as Record<string, unknown>
  return ['title', 'category', 'region'].every((key) => typeof reference[key] === 'string' && reference[key].length <= 120)
    && ['summary', 'moral'].every((key) => reference[key] === undefined || (typeof reference[key] === 'string' && reference[key].length <= 1800))
}

async function retrieveKnowledge(question: string) {
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) return []

  const response = await fetch(`${url}/rest/v1/knowledge_documents?published=eq.true&select=title,content,source_name,source_url,tags`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  if (!response.ok) return []

  const query = words(question)
  const documents = await response.json() as KnowledgeDocument[]
  const ranked = documents.map((document) => {
    const text = `${document.title} ${document.tags.join(' ')} ${document.content}`
    const score = [...query].filter((word) => words(text).has(word)).length
    return { ...document, score }
  }).sort((a, b) => b.score - a.score)
  return (ranked.some((document) => document.score > 0) ? ranked.filter((document) => document.score > 0) : ranked).slice(0, 5)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) return new Response(JSON.stringify({ error: 'AI belum dikonfigurasi.' }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const { messages, references } = await request.json()
    if (!Array.isArray(messages) || !messages.length || messages.length > 6) throw new Error('Percakapan tidak valid.')
    if (!Array.isArray(references) || references.length > 3 || !references.every(validReference)) throw new Error('Referensi tidak valid.')

    const question = messages.filter((message: unknown) => typeof message === 'object' && message !== null && (message as { role?: unknown }).role === 'user').at(-1) as { content?: unknown } | undefined
    if (typeof question?.content !== 'string' || !question.content.trim() || question.content.length > 1500) throw new Error('Pesan tidak valid.')

    const cacheKey = question.content.trim().toLowerCase()
    const cached = cache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) return new Response(JSON.stringify(cached), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const knowledge = await retrieveKnowledge(question.content)
    if (!references.length && !knowledge.length) return new Response(JSON.stringify({ message: 'Informasi itu belum tersedia dalam koleksi sumber Cerito Wong Dulu.', sources: [] }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const storyContext = references.map((reference, index) => `[CERITA ${index + 1}] Judul: ${reference.title}\nKategori: ${reference.category}\nDaerah: ${reference.region}\nRingkasan: ${reference.summary || '-'}\nPesan moral: ${reference.moral || '-'}`).join('\n\n')
    const knowledgeContext = knowledge.map((document, index) => `[SUMBER ${index + 1}] ${document.title}\n${document.content}`).join('\n\n')
    const context = [storyContext, knowledgeContext].filter(Boolean).join('\n\n')
    const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.0-flash'
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: systemInstruction }] }, contents: [{ role: 'user', parts: [{ text: `REFERENSI:\n${context}\n\nPERTANYAAN PENGGUNA:\n${question.content.trim()}` }] }], generationConfig: { maxOutputTokens: 180, temperature: 0.1 } }),
    })

    if (!response.ok) throw new Error('Provider AI tidak tersedia.')
    const data = await response.json()
    const message = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('').trim()
    if (!message) throw new Error('Provider AI tidak mengirim jawaban.')

    const result = { message, sources: knowledge.map((document) => ({ title: document.source_name, url: document.source_url })), expiresAt: Date.now() + 300000 }
    cache.set(cacheKey, result)
    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Permintaan tidak dapat diproses.'
    return new Response(JSON.stringify({ error: message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
