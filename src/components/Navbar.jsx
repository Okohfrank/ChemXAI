import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const links = ['Vision', 'Products', 'Technology', 'About', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="glass mx-4 md:mx-8 lg:mx-16 rounded-2xl px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="font-bold text-xl tracking-tight">
          <span className="text-white">Chem</span>
          <span className="text-cyan-400">XAI</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={'#' + l.toLowerCase()}
              className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors duration-300"
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA button */}
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-cyan-400 hover:bg-cyan-300 transition-all duration-300"
          style={{ color: '#020617', boxShadow: '0 0 15px rgba(34,211,238,0.3)' }}
        >
          Enter Future
        </motion.a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
        >
          <span
            className="block w-5 h-0.5 bg-cyan-400 transition-all duration-300"
            style={{ transform: open ? 'rotate(45deg) translateY(8px)' : 'none' }}
          />
          <span
            className="block w-5 h-0.5 bg-cyan-400 transition-all duration-300"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-5 h-0.5 bg-cyan-400 transition-all duration-300"
            style={{ transform: open ? 'rotate(-45deg) translateY(-8px)' : 'none' }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="glass mx-4 mt-2 rounded-2xl px-6 py-4 flex flex-col gap-4 md:hidden"
        >
          {links.map((l) => (
            <a
              key={l}
              href={'#' + l.toLowerCase()}
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-cyan-400 text-sm font-medium transition-colors duration-300"
            >
              {l}
            </a>
          ))}

          <a
            href="#contact"
            onClick={() => setOpen(false)}
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