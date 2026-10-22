import { useMemo, useState } from 'react'
import { BookOpen, Download } from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { StoryGrid } from '../components/StoryCard'
import { categories, regions, storyContent, stories } from '../data/demoStories'

const Shell = ({ title, children }) => <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><h1 className="mb-2 font-serif text-4xl font-bold text-stone-900">{title}</h1>{children}</main>
export function Explore() { const [params] = useSearchParams(); const [query, setQuery] = useState(''); const [region, setRegion] = useState(params.get('region') || ''); const filtered = useMemo(() => stories.filter((s) => (!region || s.region === region) && s.title.toLowerCase().includes(query.toLowerCase())), [query, region]); return <Shell title="Jelajahi Cerito"><p className="mb-8 text-[#6b3f20]">Temukan cerito demo berdasarkan daerah dan kategori.</p><div className="mb-8 flex flex-col gap-3 sm:flex-row"><input value={query} onChange={(e) => setQuery(e.target.value)} className="rounded-xl border border-stone-300 bg-white px-4 py-3" placeholder="Cari cerito..." /><select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-xl border border-stone-300 bg-white px-4 py-3"><option value="">Semua daerah</option>{regions.map((x) => <option key={x}>{x}</option>)}</select></div><StoryGrid stories={filtered} /></Shell> }
export function StoryDetail() {
  const { id } = useParams()
  const story = stories.find((x) => x.id === id)
  if (!story) return <Shell title="Cerito tidak ditemukan"><Link to="/jelajahi" className="text-[#9a3412]">Kembali menjelajah</Link></Shell>

  const content = storyContent[story.id] || {
    summary: 'Cerito ini sedang dihimpun dari ingatan, penuturan, dan sumber lokal masyarakat setempat.',
    moral: 'Warisan tutur hidup ketika didengar, dicatat, dan diteruskan dengan hormat.',
  }

  return <main className="min-h-screen bg-[#ece2cf] pb-16 text-[#28221d]">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:px-8 lg:py-12">
      <article className="overflow-hidden rounded-2xl bg-[#fffaf0] shadow-[0_18px_45px_rgb(78_51_24_/_0.14)]">
        <header className="relative min-h-[23rem] overflow-hidden bg-[#3c281b] sm:min-h-[30rem]">
          <img src={story.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(33_23_16_/_0.12),rgb(33_23_16_/_0.86))]" />
          <div className="relative flex min-h-[23rem] flex-col justify-end p-6 text-[#fff8ea] sm:min-h-[30rem] sm:p-10 lg:p-14">
            <p className="font-sans text-sm font-semibold tracking-[0.12em] text-[#f7d79b]">{story.category} · {story.region}</p>
            <h1 className="mt-3 max-w-3xl text-4xl text-[#fffaf0] sm:text-5xl lg:text-6xl">{story.title}</h1>
            <p className="mt-5 max-w-xl font-reading text-base leading-7 text-[#f6e8cf]">Cerito rakyat Sumatera Selatan</p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-10 sm:px-12 sm:py-14">
          <div className="mb-10 flex items-center gap-3 border-y border-[#e4d7bf] py-4 text-sm text-[#715b43]">
            <BookOpen size={19} aria-hidden="true" className="text-[#9a3412]" />
            <span>Waktu baca singkat · Koleksi cerito rakyat</span>
          </div>
          <section aria-labelledby="cerita-title">
            <h2 id="cerita-title" className="text-3xl text-[#35281f]">Cerita</h2>
            <p className="mt-5 font-reading text-lg leading-9 text-[#4a3c31] sm:text-xl">{content.summary}</p>
          </section>
          <section aria-labelledby="moral-title" className="mt-12 border-t border-[#e4d7bf] pt-9">
            <h2 id="moral-title" className="text-3xl text-[#35281f]">Pesan yang dibawa</h2>
            <p className="mt-5 border-l border-[#b56a32] pl-5 font-reading text-lg italic leading-9 text-[#5b493a] sm:text-xl">{content.moral}</p>
          </section>
        </div>
      </article>

      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl bg-[#2b493a] p-6 text-[#f8efde] shadow-[0_16px_35px_rgb(42_58_40_/_0.18)]">
          <p className="font-sans text-xs font-semibold tracking-[0.14em] text-[#e5c783]">BACA OFFLINE</p>
          <h2 className="mt-3 text-2xl text-white">Simpan cerita ini</h2>
          <p className="mt-3 font-reading leading-7 text-[#e5ddc9]">Unduhan PDF akan tersedia pada pembaruan berikutnya.</p>
          <button type="button" disabled aria-describedby="download-note" className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#d7ae58] px-4 py-3 font-semibold text-[#463319] opacity-60"><Download size={18} aria-hidden="true" />Download PDF</button>
          <p id="download-note" className="mt-3 text-xs leading-5 text-[#d7c9af]">Tombol ditampilkan lebih dulu. File PDF belum tersedia.</p>
        </div>
        <div className="mt-5 border border-[#d8c9af] bg-[#f7f0e3] p-5">
          <p className="text-xs font-semibold tracking-[0.13em] text-[#8b6546]">ASAL CERITA</p>
          <p className="mt-2 font-serif text-2xl font-bold text-[#493526]">{story.region}</p>
          <p className="mt-3 font-reading text-sm leading-6 text-[#705c48]">Versi dan detail cerita dapat berbeda menurut penutur serta daerah asalnya.</p>
        </div>
      </aside>
    </div>
  </main>
}
export function MapPage() { return <Shell title="Peta Cerito"><p className="mb-8 text-[#6b3f20]">Persebaran lokasi demo di Sumatera Selatan.</p><div className="h-[520px] overflow-hidden rounded-3xl border border-[#e8dfd1]"><MapContainer center={[-3.2, 104.3]} zoom={7} className="h-full w-full"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{[{name:'Palembang',pos:[-2.99,104.76]},{name:'Lahat',pos:[-3.78,103.54]},{name:'Pagar Alam',pos:[-4.02,103.25]}].map((x) => <Marker position={x.pos} key={x.name}><Popup>{x.name}<br />Lokasi demo.</Popup></Marker>)}</MapContainer></div></Shell> }
export function AIPage() { const [question, setQuestion] = useState(''); const submit = (e) => { e.preventDefault(); if (question) setQuestion('') }; return <Shell title="Tanya Cerito"><p className="mb-8 max-w-2xl text-[#6b3f20]">Asisten belum terhubung ke AI. UI ini siap disambungkan ke service AI terverifikasi.</p><form onSubmit={submit} className="flex max-w-3xl gap-2"><input value={question} onChange={(e) => setQuestion(e.target.value)} className="min-w-0 flex-1 rounded-2xl border border-stone-300 bg-white px-5 py-4" placeholder="Tulis pertanyaanmu..." /><button className="rounded-2xl bg-[#9a3412] px-6 py-4 font-semibold text-white">Kirim</button></form></Shell> }
export function Recommendation() { const [interest, setInterest] = useState('Legenda'); return <Shell title="Rekomendasi Cerito"><p className="mb-6 text-[#6b3f20]">Pilih minatmu untuk rekomendasi demo berbasis kategori.</p><div className="mb-8 flex flex-wrap gap-2">{categories.map((x) => <button key={x} onClick={() => setInterest(x)} className={`rounded-full px-4 py-2 text-sm ${interest === x ? 'bg-[#9a3412] text-white' : 'bg-white border border-stone-300'}`}>{x}</button>)}</div><StoryGrid stories={stories.filter((x) => x.category === interest)} /></Shell> }
export function Gallery() { return <Shell title="Galeri"><p className="mb-8 text-[#6b3f20]">Koleksi ilustrasi demo dari desain referensi.</p><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{stories.map((x) => <img key={x.id} src={x.image} alt={x.title} className="h-64 w-full rounded-2xl object-cover" />)}</div></Shell> }
export function About() { return <Shell title="Tentang Cerito Wong Dulu"><p className="max-w-2xl text-lg leading-8 text-stone-700">Cerito Wong Dulu adalah platform digital untuk melestarikan cerita rakyat Sumatera Selatan.</p></Shell> }
export function AdminDashboard() { return <Shell title="Admin"><p className="text-[#6b3f20]">Akses admin memerlukan autentikasi Supabase serta role ADMIN. Konfigurasi proyek Supabase diperlukan sebelum panel CRUD diaktifkan.</p></Shell> }
