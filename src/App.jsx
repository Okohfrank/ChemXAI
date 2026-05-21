import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AIHeadSection from './components/AIHeadSection'
import Products from './components/Products'
import Vision from './components/Vision'
import Footer from './components/Footer'

export default function App() {
  return (
    <div
      style={{
        background:
          'radial-gradient(circle at 20% 10%, rgba(34,211,238,0.12) 0%, transparent 22%), radial-gradient(circle at 80% 15%, rgba(14,165,233,0.06) 0%, transparent 30%), radial-gradient(circle at 50% 40%, rgba(14,165,233,0.08) 0%, transparent 50%), linear-gradient(180deg, #06111f 0%, #02040d 100%)',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <ParticleField />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        <Hero />
        <AIHeadSection />
        <Products />
        <Vision />
        <Footer />
      </div>
    </div>
  )
}
