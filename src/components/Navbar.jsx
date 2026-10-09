import { useState } from 'react'
import { Menu, Search, Sparkles, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import favicon from '../assets/faviconbg.png'

const links = [['/', 'Beranda'], ['/jelajahi', 'Jelajahi Cerito'], ['/peta', 'Peta Cerito'], ['/tanya-cerito', 'Tanya Cerito'], ['/tentang', 'Tentang']]
export function Brand() { return <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3"><img src={favicon} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover shadow-md sm:h-10 sm:w-10" /><span className="min-w-0"><b className="block truncate font-serif text-base leading-tight text-stone-900 sm:text-xl">Cerito Wong Dulu</b><small className="block truncate text-[10px] font-medium tracking-wide text-amber-800 sm:text-xs">Cerito Lamo, Warisan Kito</small></span></Link> }
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navLink = ({ isActive }) => `glass-action rounded-full px-3 py-1.5 font-serif text-sm tracking-[0.01em] ${isActive ? 'glass-action-active font-bold' : 'text-[#6b3f20]'}`
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return <header className="sticky top-0 z-[1001] border-b border-white/40 bg-[#faf1e3]/45 shadow-[0_8px_32px_rgba(92,54,20,0.08)] backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:h-20 sm:px-6 lg:px-8"><Brand /><nav className="hidden items-center gap-8 text-sm font-medium text-stone-700 md:flex">{links.map(([to, label]) => <NavLink key={to} to={to} onClick={scrollToTop} className={navLink} end={to === '/'}>{label}</NavLink>)}</nav><div className="flex items-center gap-2"><Link aria-label="Cari Cerito" to="/jelajahi" className="glass-action flex min-h-11 min-w-11 rounded-full p-2.5 text-stone-700"><Search size={20} /></Link><Link to="/kirim-cerito" onClick={scrollToTop} className="glass-action glass-action-primary hidden rounded-full px-5 py-2.5 text-sm font-medium sm:inline-flex"><Sparkles size={16} className="text-amber-300" />Kirim Cerito</Link><button type="button" onClick={() => setOpen(!open)} className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 transition hover:bg-white/40 md:hidden" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open}>{open ? <X /> : <Menu />}</button></div></div>
    {open && <nav className="border-t border-white/40 bg-[#faf1e3]/55 px-4 py-3 backdrop-blur-xl md:hidden">{links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => { setOpen(false); scrollToTop() }} className={({ isActive }) => `block rounded-lg px-3 py-3 text-sm font-medium ${isActive ? 'bg-white/50 text-[#9a3412]' : 'text-stone-700 hover:bg-white/40'}`} end={to === '/'}>{label}</NavLink>)}</nav>}
  </header>
}
