import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const VP = { once: false, amount: 0.15 }
const EASE = [0.22, 1, 0.36, 1]
const hasHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

/* ═══ SCROLL DIVIDER (scroll-linked, no JS animation) ═══ */
function ScrollDivider() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const w = useTransform(scrollYProgress, [0, 1], ['0%', '70%'])
  const op = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 0.4])
  return (
    <div ref={ref} className="relative h-40 flex items-center justify-center overflow-hidden">
      <motion.div className="h-px mx-auto" style={{
        width: w, opacity: op,
        background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.6), transparent)',
      }} />
      <motion.div className="absolute w-2 h-2 rounded-full" style={{
        background: '#22d3ee', opacity: op,
        boxShadow: '0 0 20px rgba(34,211,238,0.5)',
      }} />
    </div>
  )
}

/* ═══ WORD REVEAL ═══ */
function WordReveal({ text, className, delay = 0 }) {
  return (
    <span className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.45, delay: delay + i * 0.06, ease: EASE }}
          style={{ marginRight: '0.28em' }}
        >{w}</motion.span>
      ))}
    </span>
  )
}

/* ═══ COUNTER (CSS-only pulse, JS count) ═══ */
function Counter({ target, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.5 })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) { setCount(0); return }
    let frame
    const dur = 1600, t0 = performance.now()
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      setCount(Math.round((1 - (1 - p) * (1 - p) * (1 - p)) * target))
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ═══ LIVE TICKER ═══ */
function LiveTicker({ items }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 3200)
    return () => clearInterval(t)
  }, [items.length])
  return (
    <AnimatePresence mode="wait">
      <motion.span key={idx}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.25 }}
        className="text-xs tracking-wider"
        style={{ color: 'rgba(148,163,184,0.55)', fontFamily: 'monospace' }}
      >{items[idx]}</motion.span>
    </AnimatePresence>
  )
}

/* ═══ PRODUCT CARD ═══
   Desktop: RAF-throttled 3D tilt + cursor glow
   Mobile: CSS shine on tap, tap scale
   All hover/glow/shine via CSS transitions, not framer-motion
*/
function ProductCard({ product, delay, large, onPulseLaunch }) {
  const cardRef = useRef(null)
  const rafRef = useRef(null)
  const [tilt, setTilt] = useState('')
  const [glow, setGlow] = useState('50% 50%')
  const [active, setActive] = useState(false)
  const [showShine, setShowShine] = useState(false)

  const onMove = useCallback((e) => {
    if (!hasHover || !cardRef.current || rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const r = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      const i = large ? 3 : 5
      setTilt(`perspective(800px) rotateX(${y * -i}deg) rotateY(${x * i}deg) scale3d(1.015,1.015,1.015)`)
      setGlow(`${e.clientX - r.left}px ${e.clientY - r.top}px`)
    })
  }, [large])

  const onEnter = () => { setActive(true); setShowShine(true); setTimeout(() => setShowShine(false), 700) }
  const onLeave = () => { setActive(false); setTilt(''); }
  const onTap = () => { if (hasHover) return; setShowShine(true); setTimeout(() => setShowShine(false), 700) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={large ? 'col-span-1 md:col-span-2' : ''}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onTouchStart={onTap}
        className="relative rounded-2xl h-full overflow-hidden"
        style={{
          transform: tilt || 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)',
          transition: 'transform 0.35s ease-out',
        }}
      >
        {/* cursor glow (CSS only) */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(450px circle at ${glow}, rgba(34,211,238,0.06), transparent 40%)`,
          transition: 'opacity 0.4s',
        }} />

        {/* shine sweep (CSS keyframe) */}
        {showShine && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div style={{
              position: 'absolute', inset: 0, width: '30%',
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)',
              animation: 'shine-sweep 0.7s ease-in-out forwards',
            }} />
          </div>
        )}

        <div className="relative rounded-2xl p-8 flex flex-col gap-5 h-full" style={{
          background: active
            ? 'linear-gradient(145deg, rgba(14,22,40,0.98), rgba(8,16,35,0.98))'
            : 'rgba(10,18,32,0.7)',
          border: active ? '1px solid rgba(34,211,238,0.18)' : '1px solid rgba(255,255,255,0.05)',
          transition: 'background 0.4s, border-color 0.4s',
        }}>
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl" style={{
              background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.08)',
            }}>{product.icon}</div>
            <span className="text-xs font-medium tracking-wide"
              style={{ color: product.statusColor, opacity: 0.6 }}>{product.status}</span>
          </div>

          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(34,211,238,0.4)' }}>{product.sector}</p>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{product.name}</h3>
            <p className="text-xs tracking-wider mb-4" style={{ color: 'rgba(148,163,184,0.4)' }}>{product.tagline}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{product.desc}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-md" style={{
                background: active ? 'rgba(34,211,238,0.06)' : 'rgba(255,255,255,0.02)',
                color: 'rgba(148,163,184,0.55)', transition: 'background 0.3s',
              }}>{tag}</span>
            ))}
          </div>

          <div className="flex items-center gap-3 py-2">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: product.statusColor, animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <LiveTicker items={product.ticker} />
          </div>

          {product.href ? (
            onPulseLaunch ? (
              <button onClick={onPulseLaunch}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold w-fit active:scale-95 cursor-pointer"
                style={{ background: '#22d3ee', color: '#020617', transition: 'transform 0.15s', border: 'none' }}>
                Launch {product.name}
              </button>
            ) : (
              <a href={product.href} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold w-fit active:scale-95"
                style={{ background: '#22d3ee', color: '#020617', transition: 'transform 0.15s' }}>
                Visit {product.name}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="7" x2="13" y2="7" /><polyline points="8,2 13,7 8,12" />
                </svg>
              </a>
            )
          ) : (
            <p className="text-xs" style={{ color: 'rgba(148,163,184,0.3)' }}>In active development</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══ STATS ROW ═══ */
function StatsRow() {
  const stats = [
    { value: 3, suffix: '', label: 'Active Systems' },
    { value: 5, suffix: '', label: 'Industries Served' },
    { value: 24, suffix: '/7', label: 'Monitoring' },
  ]
  return (
    <div className="grid grid-cols-3 gap-6 mb-16">
      {stats.map((s, i) => (
        <motion.div key={s.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
          className="text-center"
        >
          <div className="text-3xl md:text-4xl font-bold text-white mb-1">
            <Counter target={s.value} suffix={s.suffix} />
          </div>
          <p className="text-xs tracking-wider" style={{ color: 'rgba(148,163,184,0.4)' }}>{s.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

/* ═══ AI LAYERS (CSS hover/active, one whileInView per layer) ═══ */
function AILayers() {
  const layers = [
    { label: 'Deployment', desc: 'Edge & cloud delivery', w: '100%', op: 0.6 },
    { label: 'Intelligence', desc: 'Models & prediction', w: '92%', op: 0.52 },
    { label: 'Processing', desc: 'Pipelines & analysis', w: '84%', op: 0.44 },
    { label: 'Research', desc: 'Papers & discovery', w: '76%', op: 0.36 },
    { label: 'Data', desc: 'Sensors & collection', w: '68%', op: 0.28 },
  ]
  return (
    <div>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
        className="text-xs uppercase tracking-[0.2em] mb-6 text-center md:text-left"
        style={{ color: 'rgba(148,163,184,0.4)' }}>Our stack</motion.p>
      <div className="flex flex-col gap-2">
        {layers.map((l, i) => (
          <motion.div key={l.label}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
            className="relative px-5 py-3.5 rounded-lg flex items-center justify-between cursor-default hover:translate-x-2 active:translate-x-2 active:scale-[1.02]"
            style={{
              width: l.w, marginLeft: 'auto', marginRight: 'auto',
              background: 'rgba(12,20,35,0.8)',
              borderLeft: `2px solid rgba(34,211,238,${l.op})`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <span className="text-sm font-semibold text-white">{l.label}</span>
            <span className="text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>{l.desc}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ═══ WHAT WE SERVE (CSS hover/active, one whileInView per item) ═══ */
const sectors = [
  { label: 'Healthcare', desc: 'Patient safety & monitoring', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  { label: 'Energy', desc: 'Grid & generator intelligence', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
  { label: 'Education', desc: 'Academic project tools', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg> },
  { label: 'Industry', desc: 'Automation & workflows', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
  { label: 'Research', desc: 'AI papers & articles', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
]

function WhatWeServe() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP} transition={{ duration: 0.5 }}>
        <h3 className="text-2xl font-bold text-white tracking-tight mb-2">What we serve.</h3>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(148,163,184,0.45)' }}>
          AI systems for industries where reliability isn't optional.
        </p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {sectors.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
            className="text-center p-5 rounded-xl cursor-default hover:-translate-y-1.5 active:-translate-y-1 active:scale-[1.03]"
            style={{
              background: 'rgba(10,18,32,0.6)', border: '1px solid rgba(255,255,255,0.04)',
              transition: 'transform 0.25s ease-out',
            }}
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3"
              style={{ color: 'rgba(34,211,238,0.4)' }}>{s.icon}</div>
            <p className="text-sm font-semibold text-white mb-1">{s.label}</p>
            <p className="text-xs" style={{ color: 'rgba(148,163,184,0.35)' }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ═══ CONNECT CTA ═══ */
function ConnectSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative rounded-2xl overflow-hidden mt-20"
      style={{
        background: 'linear-gradient(135deg, rgba(10,18,35,0.95), rgba(14,24,45,0.9))',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
        backgroundSize: '40px 40px', opacity: 0.6,
      }} />

      <div className="relative z-10 px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
            transition={{ duration: 0.4 }}
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: 'rgba(34,211,238,0.4)' }}>Custom AI Deployments</motion.p>
          <WordReveal
            text="Need AI agents built for your hospital, school, or industry?"
            className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4 leading-snug"
            delay={0.05}
          />
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.6)' }}>
            We build bespoke AI systems that give even underserved communities the full power
            of intelligent automation — from data to deployment.
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-3 flex-shrink-0"
        >
          <a href="mailto:officialchemxai@gmail.com"
            className="px-8 py-3.5 rounded-full text-sm font-semibold text-center active:scale-95"
            style={{ background: '#22d3ee', color: '#020617', transition: 'transform 0.15s' }}>
            Start a Conversation
          </a>
          <a href="https://www.linkedin.com/in/okoh-frank-a8a249329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full text-sm font-semibold text-center active:scale-95"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', transition: 'transform 0.15s' }}>
            Connect on LinkedIn
          </a>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ═══ PRODUCT DATA ═══ */
const products = [
  {
    name: 'PULSE', tagline: 'Predictive Utility & Life Support Systems', sector: 'Energy AI',
    desc: 'AI-powered hospital energy intelligence. Monitors generator fuel, vaccine fridge temps, NEPA grid status, and electrical load — predicting failures before they happen.',
    tags: ['Generator AI', 'NEPA Grid', 'Vaccine Cold Chain', 'Load Prediction', 'Solar ROI'],
    ticker: ['NEPA Grid — Online — Monitoring', 'Generator Fuel — 62% — 11.2 hrs remaining', 'Vaccine Fridge — 4.7°C — Stable', 'Current Load — 3,200W — 71% capacity'],
    status: 'Live', statusColor: '#34d399', href: 'https://pulse-chemxai.netlify.app', large: true,
    icon: <svg width="26" height="26" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="16" stroke="rgba(34,211,238,0.2)" strokeWidth="1"/><path d="M8 20h6l3-8 4 16 3-10 3 2h5" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    name: 'ProjexAI', tagline: 'Academic Intelligence Ecosystem', sector: 'Academic AI',
    desc: 'AI ecosystem for final year engineering students and supervisors. Finds cheapest materials, builds budgets, tracks timelines, surfaces literature, and serves as an intelligent assistant from proposal to defence day.',
    tags: ['Material Sourcing', 'Budget AI', 'Timeline Tracker', 'Literature AI'],
    ticker: ['Projects Active — Monitoring Timelines', 'Material Prices — Scanning Markets', 'Literature — Indexing Sources'],
    status: 'In Development', statusColor: '#eab308', href: null, large: false,
    icon: <svg width="26" height="26" viewBox="0 0 40 40" fill="none"><rect x="7" y="9" width="26" height="22" rx="3" stroke="rgba(34,211,238,0.25)" strokeWidth="1"/><line x1="7" y1="16" x2="33" y2="16" stroke="rgba(34,211,238,0.15)" strokeWidth="0.8"/><path d="M12 22h8M12 27h12" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  {
    name: 'Sickle Cell Smart Watch', tagline: 'AI Health Intelligence System', sector: 'Healthcare AI',
    desc: 'Wearable AI for sickle cell patients. Continuously monitors biometric signals, predicts vaso-occlusive crises before they occur, and triggers emergency protocols with sensor-driven precision.',
    tags: ['Crisis Prediction', 'Biometric AI', 'Emergency Alert', 'Sensor Fusion'],
    ticker: ['Biometrics — Monitoring — All Clear', 'Crisis Risk — Low — Stable', 'Oxygen Saturation — Analyzing'],
    status: 'Prototype Phase', statusColor: '#a855f7', href: null, large: false,
    icon: <svg width="26" height="26" viewBox="0 0 40 40" fill="none"><rect x="13" y="7" width="14" height="26" rx="4" stroke="rgba(34,211,238,0.25)" strokeWidth="1"/><path d="M16 20h2.5l2-5 2 10 2-6 1.5 1h2.5" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
]

/* ═══ PULSE LAUNCH OVERLAY ═══
   Safari/Firefox block window.open inside setTimeout — the overlay is now
   purely visual feedback while the tab opens instantly on click.           */
function PulseLaunchOverlay({ active, onComplete }) {
  useEffect(() => {
    if (!active) return
    const timer = setTimeout(onComplete, 2200)
    return () => clearTimeout(timer)
  }, [active, onComplete])

  const letters = 'PULSE'.split('')

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{ background: 'rgba(1,5,9,0.96)' }}
        >
          {/* scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 1.6, delay: 0.15, ease: 'easeInOut' }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)',
              top: '48%', transformOrigin: 'center',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
            {/* PULSE letters */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {letters.map((letter, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.07, ease: EASE }}
                  className="text-5xl sm:text-6xl md:text-8xl font-black"
                  style={{ fontFamily: "'Sora', sans-serif", color: '#22d3ee' }}
                >{letter}</motion.span>
              ))}
            </div>

            {/* tagline + launched indicator */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
              className="text-sm sm:text-base font-light"
              style={{ color: 'rgba(226,232,240,0.4)', fontFamily: "'DM Sans', sans-serif" }}
            >
              Launching in a new tab
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.7, ease: 'easeInOut' }}
              className="h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)' }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round">
                <polyline points="2,7 5.5,10.5 12,3.5"/>
              </svg>
              <span className="text-xs tracking-widest uppercase"
                style={{ color: 'rgba(34,211,238,0.45)', fontFamily: "'Sora', sans-serif" }}>
                Launched
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ═══ MAIN EXPORT ═══ */
export default function Products() {
  const [launchingPulse, setLaunchingPulse] = useState(false)
  const handlePulseLaunch = useCallback(() => {
    window.open('https://pulse-chemxai.netlify.app', '_blank')
    setLaunchingPulse(true)
  }, [])

  return (
    <section id="products" className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(3,7,18,0.92) 0%, rgba(10,22,40,0.92) 50%, rgba(3,7,18,0.92) 100%)' }}>

      <PulseLaunchOverlay active={launchingPulse} onComplete={() => setLaunchingPulse(false)} />

      {/* floating shapes — pure CSS, zero JS */}
      <div className="absolute pointer-events-none" style={{
        top: '15%', right: '8%', width: 200, height: 200,
        border: '1px solid rgba(34,211,238,0.03)', borderRadius: '30%',
        animation: 'float-a 12s ease-in-out infinite',
      }} />
      <div className="absolute pointer-events-none" style={{
        top: '60%', left: '5%', width: 150, height: 150,
        border: '1px solid rgba(34,211,238,0.025)', borderRadius: '50%',
        animation: 'float-b 16s ease-in-out infinite',
      }} />

      <ScrollDivider />

      <div className="max-w-6xl mx-auto px-6 pb-28">
        <motion.div className="mb-6">
          <motion.p initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
            transition={{ duration: 0.4 }}
            className="text-xs uppercase tracking-[0.25em] mb-3"
            style={{ color: 'rgba(34,211,238,0.4)' }}>Product Suite</motion.p>
          <WordReveal text="What we build." className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4" />
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="max-w-lg text-sm leading-relaxed"
            style={{ color: 'rgba(148,163,184,0.5)' }}>
            Intelligent systems solving real energy, health, and academic challenges across Africa and beyond.
          </motion.p>
        </motion.div>

        <StatsRow />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24">
          {products.map((p, i) => (
            <ProductCard key={p.name} product={p} delay={i * 0.08} large={p.large}
              onPulseLaunch={p.name === 'PULSE' ? handlePulseLaunch : undefined} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-8">
          <WhatWeServe />
          <AILayers />
        </div>

        {/* See More → dedicated page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5 }}
          className="flex justify-center my-16"
        >
          <Link to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-xs md:text-sm font-semibold active:scale-95 group text-center"
            style={{
              background: 'rgba(34,211,238,0.06)',
              border: '1px solid rgba(34,211,238,0.2)',
              color: '#22d3ee',
              transition: 'background 0.3s, transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,211,238,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,211,238,0.06)'}
          >
            <span>See More</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              className="flex-shrink-0 group-hover:translate-x-1" style={{ transition: 'transform 0.2s' }}>
              <path d="M3 8h10"/><path d="M9 3l5 5-5 5"/>
            </svg>
          </Link>
        </motion.div>

        <ConnectSection />
      </div>
    </section>
  )
}
