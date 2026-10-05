import { supabase } from '../lib/supabase'

export async function aiChat(messages) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')

  const { data, error } = await supabase.functions.invoke('ai-chat', { body: { messages } })
  if (error) throw new Error('Layanan AI sedang tidak tersedia. Coba lagi nanti.')
  if (!data?.message || typeof data.message !== 'string') throw new Error('Respons AI tidak valid.')
  return data.message
}
