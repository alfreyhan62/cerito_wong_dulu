import { useEffect, useState } from 'react'
import { ArrowRight, Bot, Send } from 'lucide-react'

const prompts = ['Apa makna budaya Rumah Limas?', 'Ceritakan Si Pahit Lidah.', 'Apa makna legenda Pulau Kemaro?', 'Bagaimana sejarah Jembatan Ampera?']
import { aiChat } from '../services/aiChat'

function formatMessage(content) {
  return content.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part)
}

export default function AIChat() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState(() => { try { return JSON.parse(sessionStorage.getItem('ai-cerito-messages')) || [] } catch { return [] } })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { sessionStorage.setItem('ai-cerito-messages', JSON.stringify(messages)) }, [messages])

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
      setMessages((current) => [...current, { role: 'assistant', ...response }])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="grid min-h-[500px] grid-cols-1 overflow-hidden rounded-3xl border border-[#d2c3b0] bg-[#f3eee7] shadow-sm lg:grid-cols-12">
    <section className="flex min-w-0 flex-col justify-between bg-[#f7f2eb] p-4 sm:p-5 lg:order-2 lg:col-span-9">
      <div className="max-h-[360px] space-y-4 overflow-y-auto pr-2">
        <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-amber-700 to-[#9a3412] text-amber-100"><Bot /></span><div className="min-w-0 max-w-xl rounded-2xl rounded-tl-sm border border-[#d8ccba] bg-[#fbf8f3] p-4 text-sm leading-relaxed"><b className="mb-1 block text-base">Halo!</b>Aku siap membantu kamu mengenal cerita rakyat, mitos, legenda lokal, dan kebudayaan Sumatera Selatan.</div></div>
        {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>{message.role === 'assistant' && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-amber-700 to-[#9a3412] text-amber-100"><Bot size={18} /></span>}<div className={`max-w-xl rounded-2xl border p-4 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-tr-sm border-[#9a3412] bg-[#9a3412] text-white' : 'rounded-tl-sm border-[#d8ccba] bg-[#fbf8f3]'}`}>{formatMessage(message.content)}</div></div>)}
        {loading && <div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-amber-700 to-[#9a3412] text-amber-100"><Bot size={18} /></span><div className="rounded-2xl rounded-tl-sm border border-[#d8ccba] bg-[#fbf8f3] p-4 text-sm text-stone-600">Sedang menyiapkan jawaban...</div></div>}
        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      </div>
      <div className="mt-8"><form onSubmit={send} className="flex gap-3 rounded-2xl border border-[#d2c3b0] bg-[#fbf8f3] p-2"><input value={value} onChange={(event) => setValue(event.target.value)} disabled={loading} placeholder="Tulis pertanyaanmu..." className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none disabled:opacity-50" /><button type="submit" disabled={loading || !value.trim()} className="grid h-10 w-10 place-items-center rounded-xl bg-[#9a3412] text-white disabled:opacity-50"><Send size={17} /></button></form><p className="mt-3 flex items-center gap-1 text-xs text-stone-500">Hanya menjawab koleksi cerita Cerito Wong Dulu <ArrowRight size={14} /></p></div>
    </section>
    <aside className="order-first min-w-0 border-b border-[#d2c3b0] bg-[#ece3d6] p-3 sm:p-4 lg:order-1 lg:col-span-3 lg:border-b-0 lg:border-r">
      <div className="grid gap-1.5">{prompts.map((prompt) => <button key={prompt} onClick={(event) => send(event, prompt)} disabled={loading} className="w-full rounded-xl border border-transparent p-2 text-left text-[10px] leading-snug disabled:opacity-50 hover:border-[#9a3412] hover:bg-[#faf6f0]"><b className="block line-clamp-2">{prompt}</b></button>)}</div>
    </aside>
  </div>
}
