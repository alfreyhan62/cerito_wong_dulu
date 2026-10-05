import { supabase } from '../lib/supabase'

export async function getStories() {
  if (!supabase) return []
  const { data, error } = await supabase.from('stories').select('*, categories(name, slug), regions(name, slug)').eq('status', 'published')
  if (error) throw error
  return data
}
