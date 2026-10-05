import { useState } from 'react'
import { ArrowRight, Bot, Clock3, Send } from 'lucide-react'
import { aiChat } from '../services/aiChat'

const prompts = ['Cerita rakyat apa yang berasal dari Palembang?', 'Apa pesan moral cerita Si Pahit Lidah?', 'Cerita apa yang cocok untuk anak-anak?', 'Siapa tokoh utama dalam cerita ini?']

export default function AIChat() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const send = async (event, prompt = value) => {
    event?.preventDefault()
    const content = prompt.trim()
    if (!content || loading) return

    const conversation = [...messages, { role: 'user', content }]
    setMessages(conversation)
    setValue('')
    setError('')
    setLoading(true)

    try {
      const response = await aiChat(conversation)
      setMessages((current) => [...current, { role: 'assistant', content: response }])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="grid min-h-[580px] grid-cols-1 overflow-hidden rounded-3xl border border-[#d2c3b0] bg-[#f3eee7] shadow-sm lg:grid-cols-12">
    <aside className="flex flex-col justify-between border-b border-[#d2c3b0] bg-[#ece3d6] p-5 sm:p-6 lg:col-span-4 lg:border-b-0 lg:border-r">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-[#d2c3b0] pb-4 text-sm font-semibold"><span className="flex items-center gap-2"><Clock3 size={16} className="text-[#9a3412]" />Riwayat Percakapan</span><button onClick={() => { setMessages([]); setError(''); setValue('') }} className="text-xs text-[#9a3412]">+ Chat Baru</button></div>
        {['Cerito Putri Kembang Dadar', 'Tokoh dalam cerita Si Pahit Lidah', 'Pesan moral cerita Danau Ranau', 'Cerita populer anak Ogan Komering'].map((item, index) => <button key={item} className={`mb-2 w-full rounded-2xl border p-3 text-left text-xs ${index === 0 ? 'border-[#9a3412] bg-[#faf6f0] shadow-sm' : 'border-transparent'}`}><b className="block truncate">{item}</b><span className="block truncate text-[11px] text-stone-500">Riwayat percakapan demo</span></button>)}
      </div>
      <p className="border-t border-[#d2c3b0] pt-4 text-xs text-stone-600">AI aktif dalam Bahasa Indonesia & Palembang</p>
    </aside>
    <section className="flex flex-col justify-between bg-[#f7f2eb] p-5 sm:p-7 lg:col-span-8">
      <div className="space-y-6">
        <div className="flex gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-amber-700 to-[#9a3412] text-amber-100"><Bot /></span><div className="max-w-xl rounded-2xl rounded-tl-sm border border-[#d8ccba] bg-[#fbf8f3] p-5 text-sm leading-relaxed"><b className="mb-1 block text-base">Halo!</b>Aku siap membantu kamu mengenal cerita rakyat, mitos, legenda lokal, dan kebudayaan Sumatera Selatan.</div></div>
        {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>{message.role === 'assistant' && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-amber-700 to-[#9a3412] text-amber-100"><Bot size={18} /></span>}<div className={`max-w-xl rounded-2xl border p-4 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-tr-sm border-[#9a3412] bg-[#9a3412] text-white' : 'rounded-tl-sm border-[#d8ccba] bg-[#fbf8f3]'}`}>{message.content}</div></div>)}
        {loading && <div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-amber-700 to-[#9a3412] text-amber-100"><Bot size={18} /></span><div className="rounded-2xl rounded-tl-sm border border-[#d8ccba] bg-[#fbf8f3] p-4 text-sm text-stone-600">Sedang menyiapkan jawaban...</div></div>}
        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      </div>
      <div className="mt-8"><div className="mb-3 flex flex-wrap gap-2">{prompts.map((prompt) => <button key={prompt} onClick={(event) => send(event, prompt)} disabled={loading} className="rounded-full border border-[#d2c3b0] bg-[#fbf8f3] px-3 py-2 text-xs text-stone-700 disabled:opacity-50">{prompt}</button>)}</div><form onSubmit={send} className="flex gap-3 rounded-2xl border border-[#d2c3b0] bg-[#fbf8f3] p-2"><input value={value} onChange={(event) => setValue(event.target.value)} disabled={loading} placeholder="Tulis pertanyaanmu..." className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none disabled:opacity-50" /><button type="submit" disabled={loading || !value.trim()} className="grid h-10 w-10 place-items-center rounded-xl bg-[#9a3412] text-white disabled:opacity-50"><Send size={17} /></button></form><p className="mt-3 flex items-center gap-1 text-xs text-stone-500">Jelajahi cerita Sumatera Selatan <ArrowRight size={14} /></p></div>
    </section>
  </div>
}
