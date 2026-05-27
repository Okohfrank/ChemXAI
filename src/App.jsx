import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Products from './components/Products'
import About from './components/About'
import Vision from './components/Vision'
import Technology from './components/Technology'
import Contact from './components/Contact'
import ProductsPage from './pages/ProductsPage'

function Landing() {
  return (
    <>
      <Hero />
      <Products />
      <About />
      <Vision />
      <Technology />
      <Contact />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#010509', minHeight: '100vh', position: 'relative' }}>
        <ParticleField />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/products" element={<ProductsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
