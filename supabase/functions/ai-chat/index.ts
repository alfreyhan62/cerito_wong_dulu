const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
}

const systemInstruction = 'Kamu adalah Cerito AI, asisten budaya Sumatera Selatan. Jawab dalam Bahasa Indonesia yang ramah, ringkas, dan jujur. Utamakan cerita rakyat, sejarah lokal, dan budaya Sumatera Selatan. Jika informasi tidak pasti, katakan perlu verifikasi sumber tepercaya. Jangan mengarang sumber atau fakta.'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) return new Response(JSON.stringify({ error: 'AI belum dikonfigurasi.' }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const { messages } = await request.json()
    if (!Array.isArray(messages) || !messages.length || messages.length > 12) throw new Error('Percakapan tidak valid.')

    const contents = messages.map(({ role, content }: { role: string; content: string }) => {
      if (!['user', 'assistant'].includes(role) || typeof content !== 'string' || !content.trim() || content.length > 1500) throw new Error('Pesan tidak valid.')
      return { role: role === 'assistant' ? 'model' : 'user', parts: [{ text: content.trim() }] }
    })

    const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.0-flash'
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: systemInstruction }] }, contents, generationConfig: { maxOutputTokens: 500, temperature: 0.5 } }),
    })

    if (!response.ok) throw new Error('Provider AI tidak tersedia.')
    const data = await response.json()
    const message = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('').trim()
    if (!message) throw new Error('Provider AI tidak mengirim jawaban.')

    return new Response(JSON.stringify({ message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Permintaan tidak dapat diproses.'
    return new Response(JSON.stringify({ error: message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
