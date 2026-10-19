import { supabase } from '../lib/supabase'
import { stories, storyContent } from '../data/demoStories'

const stopWords = new Set(['apa', 'yang', 'dan', 'atau', 'dari', 'untuk', 'dengan', 'dalam', 'cerita', 'rakyat', 'legenda', 'kisah', 'tentang', 'siapa', 'bagaimana', 'dimana', 'mana', 'pada', 'ini', 'itu', 'di'])

function words(value) {
  return new Set(value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g)?.filter((word) => word.length > 2 && !stopWords.has(word)) || [])
}

function retrieveStories(question) {
  const query = words(question)
  return stories.map((story) => {
    const content = storyContent[story.id]
    const source = `${story.title} ${story.category} ${story.region} ${content?.summary || ''} ${content?.moral || ''}`
    const score = [...query].filter((word) => words(source).has(word)).length
    return { title: story.title, category: story.category, region: story.region, summary: content?.summary, moral: content?.moral, score }
  }).filter((story) => story.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((story) => ({ title: story.title, category: story.category, region: story.region, summary: story.summary, moral: story.moral }))
}

export async function aiChat(messages) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')

  const question = messages.filter((message) => message.role === 'user').at(-1)?.content || ''
  const references = retrieveStories(question)
  const { data, error } = await supabase.functions.invoke('ai-chat', { body: { messages, references } })
  if (error) throw new Error('Layanan AI sedang tidak tersedia. Coba lagi nanti.')
  if (!data?.message || typeof data.message !== 'string') throw new Error('Respons AI tidak valid.')
  return data.message
}
