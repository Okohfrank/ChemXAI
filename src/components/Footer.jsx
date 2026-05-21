import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-cyan-400/10 py-16 px-6 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-2xl font-black tracking-tight"
        >
          <span className="text-white">Chem</span>
          <span className="text-cyan-400">XAI</span>
        </motion.div>

        <p className="text-slate-500 text-center max-w-md text-sm">
          Engineering intelligence for resilient infrastructure, health, and education.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {['Vision', 'Products', 'Technology', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-cyan-400 hover:text-white transition-colors duration-300">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
