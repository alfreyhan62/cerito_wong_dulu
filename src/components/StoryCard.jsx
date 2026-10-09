import { BookOpen, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const colors = { Legenda: 'bg-[#9a3412] text-amber-100', 'Asal Usul': 'bg-[#466556] text-emerald-100', Kerajaan: 'bg-[#b45309] text-amber-100' }

export default function StoryCard({ story }) {
  return <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/55 bg-[#fdfbf7]/70 shadow-[0_8px_28px_rgb(73_43_19_/_0.08)] backdrop-blur-xl transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgb(73_43_19_/_0.14)]">
    <div className="relative h-48 overflow-hidden"><img src={story.image} alt={story.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /><span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm ${colors[story.category] || colors.Legenda}`}>{story.category}</span></div>
    <div className="flex flex-grow flex-col justify-between p-5"><div><h3 className="font-serif text-lg font-bold text-[#2d241e] transition-colors group-hover:text-[#9a3412]">{story.title}</h3><p className="mt-1 text-xs text-stone-600">{story.category}</p><p className="mt-1.5 flex items-center gap-1 text-xs text-stone-500"><MapPin size={14} className="text-[#9a3412]" />{story.region}</p></div><Link to={`/cerito/${story.id}`} className="glass-action mt-4 min-h-11 self-start rounded-full px-3 py-2 text-xs font-semibold text-[#9a3412]">Baca Cerito <span>→</span></Link></div>
  </article>
}

export function StoryGrid({ stories }) { return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{stories.map((story) => <StoryCard story={story} key={story.id} />)}</div> }
export function StoryIcon() { return <BookOpen size={20} className="text-amber-200" fill="currentColor" /> }
