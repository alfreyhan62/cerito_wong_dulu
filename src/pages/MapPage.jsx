import { useEffect, useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { categories, stories } from '../data/demoStories'

const markerPositions = {
  Palembang: [-2.99, 104.76, '#f59e0b'],
  Lahat: [-3.78, 103.54, '#f97316'],
  'Pagar Alam': [-4.02, 103.25, '#eab308'],
  'Ogan Ilir': [-3.23, 104.65, '#16a34a'],
  'Muara Enim': [-3.65, 103.77, '#0ea5e9'],
  OKU: [-4.13, 104.17, '#8b5cf6'],
  OKI: [-3.45, 105.22, '#ec4899'],
  'Musi Banyuasin': [-2.88, 103.83, '#14b8a6'],
  Banyuasin: [-2.61, 104.10, '#f43f5e'],
  'Empat Lawang': [-3.73, 102.81, '#a855f7'],
  'Musi Rawas': [-3.12, 102.99, '#22c55e'],
  'Musi Rawas Utara': [-2.53, 102.86, '#06b6d4'],
  'OKU Selatan': [-4.76, 104.03, '#f97316'],
  'OKU Timur': [-3.86, 104.75, '#eab308'],
  PALI: [-3.25, 104.14, '#84cc16'],
}

export default function MapPage() {
  const [category, setCategory] = useState('Semua')
  const [region, setRegion] = useState(stories[0].region)
  const [southSumatra, setSouthSumatra] = useState(null)
  useEffect(() => {
    fetch('/sumatera-selatan.json')
      .then((response) => response.json())
      .then(([place]) => setSouthSumatra(place.geojson))
  }, [])
  const filteredStories = useMemo(
    () => stories.filter((story) => (category === 'Semua' || story.category === category) && markerPositions[story.region]),
    [category],
  )
  const activeStories = filteredStories.filter((story) => story.region === region)
  const displayedStories = activeStories.length ? activeStories : filteredStories
  const visibleRegions = [...new Set(filteredStories.map((story) => story.region))]
  const outsideSouthSumatra = useMemo(() => southSumatra && ({ type: 'Polygon', coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]], ...southSumatra.coordinates] }), [southSumatra])

  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <header className="mx-auto mb-6 max-w-3xl text-center">
      <h1 className="mt-3 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">Peta Cerito Rakyat Sumatera Selatan</h1>
      <p className="mt-2 text-sm text-[#6b3f20]">Jelajahi cerita berdasarkan daerah asalnya secara interaktif melalui peta persebaran budaya Bumi Sriwijaya.</p>
    </header>
    <div className="mb-6 flex snap-x gap-2 overflow-x-auto scroll-px-4 rounded-2xl border border-[#d5c7b5] bg-[#f5efe6] p-4">
      {['Semua', ...categories.filter((item) => item !== 'Petualangan')].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`glass-action min-h-11 snap-start whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium ${category === item ? 'glass-action-active' : 'text-stone-600'}`}>{item}</button>)}
    </div>
    <div className="overflow-hidden rounded-3xl border-4 border-[#27362e] bg-[#0b1c14] shadow-2xl">
      <div className="map-pattern h-[360px] sm:h-[560px]">
        <MapContainer center={[-3.4, 104.3]} zoom={8} scrollWheelZoom={false} className="map-south-sumatra h-full w-full">
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {outsideSouthSumatra && <GeoJSON data={outsideSouthSumatra} style={{ color: '#235c4b', fillColor: '#6b7280', fillOpacity: 0.82, weight: 3 }} interactive={false} />}
          {visibleRegions.map((name) => {
            const [latitude, longitude, color] = markerPositions[name]
            return <CircleMarker key={name} center={[latitude, longitude]} radius={region === name ? 11 : 8} pathOptions={{ color: 'white', fillColor: color, fillOpacity: 1, weight: region === name ? 4 : 2 }} eventHandlers={{ click: () => setRegion(name) }}>
              <Popup>{name}</Popup>
            </CircleMarker>
          })}
        </MapContainer>
      </div>
      <aside className="border-t-4 border-[#27362e] bg-[#f5efe6] p-6">
        {displayedStories.length ? <>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8b2e0f]">Wilayah Aktif</span>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h2 className="mt-1 font-serif text-2xl font-bold text-stone-900">{displayedStories[0].region}</h2>
            <p className="text-sm text-stone-600">{displayedStories.length} cerita tersedia</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedStories.map((story) => <article key={story.id} className="rounded-2xl border border-[#d5c7b5] bg-white p-3">
              <img className="h-40 w-full rounded-xl object-cover" src={story.image} alt={story.title} />
              <h3 className="mt-3 font-serif text-lg font-bold text-stone-900">{story.title}</h3>
              <p className="mt-1 text-xs text-stone-600">{story.category}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-stone-500"><MapPin size={14} className="text-[#9a3412]" />{story.region}</p>
              <Link className="glass-action glass-action-primary mt-3 rounded-xl px-4 py-2 text-sm font-bold" to={`/cerito/${story.id}`}>Buka Cerita <MapPin size={15} /></Link>
            </article>)}
          </div>
        </> : <p className="text-sm text-stone-600">Belum ada cerita untuk kategori ini.</p>}
      </aside>
    </div>
  </main>
}
