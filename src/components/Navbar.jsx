import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

const links = ['Products', 'About', 'Vision', 'Technology', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (e, section) => {
    e.preventDefault()
    setOpen(false)
    const hash = '#' + section.toLowerCase()

    if (location.pathname === '/') {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/' + hash)
    }
  }

  const handleLogo = (e) => {
    e.preventDefault()
    setOpen(false)
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="mx-4 md:mx-8 lg:mx-16 rounded-2xl px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(6,12,24,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <a href="/" onClick={handleLogo} className="flex items-center gap-2 select-none">
          <img src="/ChemXAI.png" alt="ChemXAI" className="h-10 md:h-11" style={{ objectFit: 'contain' }} />
          <span className="text-xl tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            <span style={{ color: '#fff', fontWeight: 300 }}>Chem</span>
            <span style={{ color: '#22d3ee', fontWeight: 800 }}>XAI</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={'#' + l.toLowerCase()}
              onClick={(e) => handleNav(e, l)}
              className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors duration-300"
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA button */}
        <a
          href="#contact"
          onClick={(e) => handleNav(e, 'Contact')}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-cyan-300 border border-cyan-400/40 transition-all duration-300 hover:bg-cyan-400/10 active:scale-95"
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(34,211,238,0.06)' }}
        >
          Enter Future
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
        >
          <span
            className="block w-5 h-0.5 bg-cyan-400 transition-all duration-300"
            style={{ transform: open ? 'translateY(8px) rotate(45deg)' : 'none' }}
          />
          <span
            className="block w-5 h-0.5 bg-cyan-400 transition-all duration-300"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-5 h-0.5 bg-cyan-400 transition-all duration-300"
            style={{ transform: open ? 'translateY(-8px) rotate(-45deg)' : 'none' }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-4 mt-2 rounded-2xl px-6 py-4 flex flex-col gap-4 md:hidden" style={{ background: 'rgba(6,12,24,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {links.map((l) => (
            <a
              key={l}
              href={'#' + l.toLowerCase()}
              onClick={(e) => handleNav(e, l)}
              className="text-slate-300 hover:text-cyan-400 text-sm font-medium transition-colors duration-300"
            >
              {l}
            </a>
          ))}

          <a
            href="#contact"
            onClick={(e) => handleNav(e, 'Contact')}
            className="text-center px-5 py-2.5 rounded-full text-sm font-semibold bg-cyan-400"
            style={{ color: '#020617' }}
          >
            Enter Future
          </a>
        </motion.div>
      )}
    </motion.nav>
  )
}
