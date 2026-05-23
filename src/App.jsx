import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Products from './components/Products'
import Vision from './components/Vision'
import Footer from './components/Footer'

export default function App() {
  return (
    <div style={{ background: '#010509', minHeight: '100vh', position: 'relative' }}>
      <ParticleField />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        <Hero />
        <Products />
        <Vision />
        <Footer />
      </div>
    </div>
  )
}
