import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { AdminDashboard, Gallery, Recommendation, StoryDetail } from './pages/Pages'
import About from './pages/About'
import AIPage from './pages/AIPage'
import Explore from './pages/Explore'
import MapPage from './pages/MapPage'
import ScrollReveal from './components/ScrollReveal'

export default function App() { return <BrowserRouter><ScrollReveal><Navbar /><Routes><Route path="/" element={<Home />} /><Route path="/jelajahi" element={<Explore />} /><Route path="/cerito/:id" element={<StoryDetail />} /><Route path="/peta" element={<MapPage />} /><Route path="/tanya-cerito" element={<AIPage />} /><Route path="/rekomendasi" element={<Recommendation />} /><Route path="/galeri" element={<Gallery />} /><Route path="/tentang" element={<About />} /><Route path="/admin" element={<AdminDashboard />} /></Routes><Footer /></ScrollReveal></BrowserRouter> }
