import { useState } from 'react'
import { Menu, Search, Sparkles, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import favicon from '../assets/faviconbg.png'

const links = [['/', 'Beranda'], ['/jelajahi', 'Jelajahi Cerito'], ['/peta', 'Peta Cerito'], ['/tanya-cerito', 'Tanya Cerito'], ['/tentang', 'Tentang']]
export function Brand() { return <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3"><img src={favicon} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover shadow-md sm:h-10 sm:w-10" /><span className="min-w-0"><b className="block truncate font-display text-base font-bold leading-tight tracking-[-0.025em] text-white sm:text-xl">Cerito Wong Dulu</b><small className="block truncate text-[10px] font-medium tracking-wide text-amber-300 sm:text-xs">Cerito Lamo, Warisan Kito</small></span></Link> }
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navLink = ({ isActive }) => `rounded-full border px-4 py-2 text-sm tracking-[0.01em] transition-colors ${isActive ? 'border-amber-500/60 bg-[#a93b16] font-bold text-amber-50 shadow-[inset_0_-2px_0_rgb(251_191_36_/_0.55)]' : 'border-transparent text-amber-100/80 hover:border-amber-400/30 hover:bg-white/10 hover:text-amber-100'}`
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return <header className="sticky top-0 z-[1001] border-b border-amber-500/40 bg-[#182319]/95 shadow-[0_8px_28px_rgba(31,20,8,0.35)] backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:h-20 sm:px-6 lg:px-8"><Brand /><nav className="hidden items-center gap-3 text-sm font-medium md:flex">{links.map(([to, label]) => <NavLink key={to} to={to} onClick={scrollToTop} className={navLink} end={to === '/'}>{label}</NavLink>)}</nav><div className="flex items-center gap-2"><Link aria-label="Cari Cerito" to="/jelajahi" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-amber-400/50 text-amber-200 transition hover:bg-white/10"><Search size={20} /></Link><Link to="/kirim-cerito" onClick={scrollToTop} className="hidden rounded-full border border-amber-500/50 bg-[#a93b16] px-5 py-2.5 text-sm font-medium text-amber-50 shadow-[inset_0_-2px_0_rgb(251_191_36_/_0.4)] transition hover:bg-[#c24b1d] sm:inline-flex"><Sparkles size={16} className="text-amber-300" />Kirim Cerito</Link><button type="button" onClick={() => setOpen(!open)} className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-amber-200 transition hover:bg-white/10 md:hidden" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open}>{open ? <X /> : <Menu />}</button></div></div>
    {open && <nav className="border-t border-amber-500/30 bg-[#182319] px-4 py-3 md:hidden">{links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => { setOpen(false); scrollToTop() }} className={({ isActive }) => `block rounded-lg px-3 py-3 text-sm font-medium ${isActive ? 'bg-[#a93b16] text-amber-50' : 'text-amber-100/80 hover:bg-white/10'}`} end={to === '/'}>{label}</NavLink>)}</nav>}
  </header>
}
