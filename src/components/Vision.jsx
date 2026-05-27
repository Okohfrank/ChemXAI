import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

function WorldGrid() {
  const hLines = Array.from({ length: 8 }, (_, i) => i)
  const vLines = Array.from({ length: 12 }, (_, i) => i)

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      {hLines.map((i) => (
        <motion.line
          key={`h${i}`}
          x1="0" y1={`${(i / hLines.length) * 100}%`}
          x2="100%" y2={`${(i / hLines.length) * 100}%`}
          stroke="rgba(34,211,238,0.07)"
          strokeWidth="1"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
      {vLines.map((i) => (
        <motion.line
          key={`v${i}`}
          x1={`${(i / vLines.length) * 100}%`} y1="0"
          x2={`${(i / vLines.length) * 100}%`} y2="100%"
          stroke="rgba(34,211,238,0.07)"
          strokeWidth="1"
          animate={{ opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
        />
      ))}
      {[20, 50, 78].map((x, i) => (
        <motion.line
          key={`d${i}`}
          x1={`${x}%`} y1="0%"
          x2={`${x + 15}%`} y2="100%"
          stroke="rgba(34,211,238,0.04)"
          strokeWidth="40"
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: i * 2.5, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

const stats = [
  { num: '4', label: 'AI systems', sub: 'designed and deployed' },
  { num: '∞', label: 'industries', sub: 'built to scale across' },
  { num: '1B+', label: 'people', sub: 'who deserve access to AI' },
]

const headingLines = [
  { text: 'We are building', style: { color: '#fff' } },
  { text: 'autonomous systems', style: { color: '#22d3ee' } },
  { text: 'for the future', style: { color: '#fff' } },
  { text: 'of Africa.', style: { color: 'rgba(226,232,240,0.38)' } },
]

export default function Vision() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section
      id="vision"
      ref={ref}
      className="relative py-20 md:py-36 px-4 md:px-6 overflow-hidden"
      style={{ background: 'rgba(3,7,18,0.92)' }}
    >
      <WorldGrid />

      <motion.div
        style={{ y }}
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-10 md:gap-16"
      >
        {/* ── STATEMENT ── */}
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: "'Sora', sans-serif", color: 'rgba(34,211,238,0.6)' }}
          >
            Vision
          </motion.span>

          <h2
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {headingLines.map((line, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: EASE }}
                style={line.style}
              >
                {line.text}
              </motion.span>
            ))}
          </h2>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.12, ease: EASE }}
              className="flex flex-col items-center py-5 px-2 md:py-8 md:px-4 gap-1 rounded-xl"
              style={{ background: 'rgba(8,18,37,0.55)', backdropFilter: 'blur(12px)' }}
            >
              <span
                className="text-2xl sm:text-3xl md:text-5xl font-black"
                style={{ fontFamily: "'Sora', sans-serif", color: '#22d3ee', fontVariantNumeric: 'tabular-nums' }}
              >
                {s.num}
              </span>
              <span className="text-white font-bold text-xs md:text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>{s.label}</span>
              <span className="text-slate-600 text-[10px] md:text-xs text-center">{s.sub}</span>
            </motion.div>
          ))}
        </div>

        {/* ── CLOSING ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col items-center gap-4 md:gap-5"
        >
          <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg px-2">
            From hospitals running on generators to students navigating final year projects —
            intelligent infrastructure should be a right, not a privilege.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, color: '#22d3ee' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-widest uppercase"
            style={{
              fontFamily: "'Sora', sans-serif",
              color: 'rgba(34,211,238,0.55)',
              borderBottom: '1px solid rgba(34,211,238,0.2)',
              paddingBottom: '3px',
              willChange: 'transform',
              transition: 'color 0.25s',
            }}
          >
            Join the mission
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="6" x2="11" y2="6"/><polyline points="7,2 11,6 7,10"/>
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}
