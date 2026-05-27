import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

const VP = { once: false, amount: 0.15 }
const EASE = [0.22, 1, 0.36, 1]

/* ═══ TYPEWRITER — types out text as you scroll to it ═══ */
function Typewriter({ text, className, speed = 35 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.3 })
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inView) { setDisplayed(''); setDone(false); return }
    let i = 0
    setDone(false)
    const iv = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(iv); setDone(true) }
    }, speed)
    return () => clearInterval(iv)
  }, [inView, text, speed])

  return (
    <span ref={ref} className={className}>
      {displayed}
      {!done && inView && (
        <span className="inline-block w-[3px] h-[1em] ml-0.5 align-middle"
          style={{ background: '#22d3ee', animation: 'blink-cursor 0.8s step-end infinite' }} />
      )}
    </span>
  )
}

/* ═══ SCROLL-REVEAL TEXT — each word fades from blur as you scroll ═══ */
function ScrollRevealText({ text, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.3'] })
  const words = text.split(' ')

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return <ScrollWord key={i} word={word} range={[start, end]} progress={scrollYProgress} />
      })}
    </p>
  )
}

function ScrollWord({ word, range, progress }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const blur = useTransform(progress, range, [4, 0])
  const [style, setStyle] = useState({ opacity: 0.12, filter: 'blur(4px)' })

  useMotionValueEvent(opacity, 'change', (v) => {
    setStyle(prev => ({ ...prev, opacity: v }))
  })
  useMotionValueEvent(blur, 'change', (v) => {
    setStyle(prev => ({ ...prev, filter: `blur(${v}px)` }))
  })

  return (
    <span className="inline-block mr-[0.3em] transition-none" style={style}>
      {word}
    </span>
  )
}

/* ═══ 3D FLIP CARD — flips in from the side on scroll ═══ */
function FlipIn({ children, delay = 0, direction = 'left' }) {
  const rotateFrom = direction === 'left' ? -60 : 60
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: rotateFrom, transformPerspective: 1200 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={VP}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}

/* ═══ COUNTER ═══ */
function Counter({ target, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.5 })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) { setCount(0); return }
    let frame
    const dur = 1400, t0 = performance.now()
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      setCount(Math.round((1 - (1 - p) ** 3) * target))
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ═══ VALUES ═══ */
const values = [
  { num: '01', title: 'Underserved First', desc: 'Every system we build is pressure-tested against the hardest environments — no reliable power, no stable internet, limited resources. If it works there, it works everywhere.' },
  { num: '02', title: 'Deploy, Don\'t Demo', desc: 'We ship real systems to real users in real environments. ChemXAI does not build proof-of-concepts that sit in boardrooms. PULSE is live. ProjexAI is live. That is the standard.' },
  { num: '03', title: 'Intelligence as Infrastructure', desc: 'AI is not a feature. It is the foundation. Every ChemXAI product is designed so that intelligence is load-bearing — remove it and the system fails.' },
  { num: '04', title: 'Open Power', desc: 'The full capability of AI automation should not be locked behind enterprise contracts. A rural hospital and a Fortune 500 should run equivalent intelligence.' },
]

/* ═══ MILESTONES ═══ */
const milestones = [
  { year: '2023', label: 'The Problem Appears', desc: 'A chemical engineering lecturer\'s process monitoring problem had no affordable intelligent solution. A Python script became the first prototype.', status: 'origin' },
  { year: '2024', label: 'ChemXAI is Founded', desc: 'The vision expanded. One product became three. ChemXAI was formally established as the vehicle for engineering AI systems across Africa.', status: 'done' },
  { year: '2025', label: 'PULSE Goes Live', desc: 'PULSE launched to its first hospital users in Nigeria. Real generator data, real vaccine fridge monitoring, real NEPA grid intelligence.', status: 'done' },
  { year: '2025', label: 'ProjexAI Launches', desc: 'AI project management for Nigerian engineering students — from material sourcing to defence day. First real academic AI deployment in the region.', status: 'done' },
  { year: '2026', label: 'Sickle Cell Watch', desc: 'Hardware meets AI. The Sickle Cell Smart Watch enters prototype — wearable biometric intelligence for crisis prediction.', status: 'active' },
  { year: 'Next', label: 'Scale Across Africa', desc: 'More products. More industries. More underserved communities with access to the full power of intelligent automation.', status: 'future' },
]

function TimelineNode({ milestone, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-40px' })
  const dotColor = { origin: '#a855f7', done: '#22d3ee', active: '#22d3ee', future: 'rgba(255,255,255,0.12)' }[milestone.status]
  const isActive = milestone.status === 'active'
  const isFuture = milestone.status === 'future'
  const fromX = index % 2 === 0 ? -50 : 50

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromX }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: fromX }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex gap-5 items-start"
    >
      <div className="flex flex-col items-center flex-shrink-0 pt-1">
        <div
          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
          style={{
            background: dotColor,
            animationName: inView && !isFuture ? 'timeline-pulse' : 'none',
            animationDuration: '2s',
            animationTimingFunction: 'ease-in-out',
            animationDelay: `${index * 0.3}s`,
            animationIterationCount: 'infinite',
          }}
        />
        {index < milestones.length - 1 && (
          <motion.div
            initial={{ height: 0 }}
            animate={inView ? { height: 64 } : { height: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-px mt-2"
            style={{ background: 'linear-gradient(to bottom, rgba(34,211,238,0.25), transparent)' }}
          />
        )}
      </div>

      <div className="pb-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="text-xs px-2.5 py-0.5 rounded font-semibold"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: 'rgba(255,255,255,0.04)',
              color: isFuture ? 'rgba(255,255,255,0.2)' : 'rgba(34,211,238,0.8)',
            }}>
            {milestone.year}
          </span>
          {isActive && (
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: 'rgba(34,239,172,0.1)',
                color: '#34efac',
                letterSpacing: '0.12em',
              }}>
              Active
            </span>
          )}
        </div>
        <h4 className="font-bold text-base mb-1" style={{ color: isFuture ? 'rgba(255,255,255,0.25)' : '#e2e8f0', fontFamily: "'Sora', sans-serif" }}>
          {milestone.label}
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: isFuture ? 'rgba(255,255,255,0.12)' : 'rgba(148,163,184,0.55)' }}>
          {milestone.desc}
        </p>
      </div>
    </motion.div>
  )
}

/* ═══ DIFFERENTIATORS ═══ */
const differentiators = [
  { num: '001', title: 'African-Born Intelligence', desc: 'Built in Africa, from scratch, for conditions Western AI infrastructure was never designed to handle — NEPA outages, fuel scarcity, bandwidth constraints.' },
  { num: '002', title: 'One Engineer. Full Stack.', desc: 'Designed, trained, deployed, and maintained by a chemical engineer who also writes the ML models and the frontend. Cross-domain understanding others cannot replicate.' },
  { num: '003', title: 'Hardware Meets Software', desc: 'From PLC-connected industrial monitors to wearable health sensors — we build the intelligence layer that connects physical systems to AI decision-making.' },
]

/* ═══ SOCIAL ICONS (circled, bold, no labels) ═══ */
const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/okoh-frank-a8a249329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 0 22.222 0h.003z"/> },
  { label: 'GitHub', href: 'https://github.com/Okohfrank', icon: <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/> },
  { label: 'X', href: 'https://x.com/osaigiefrank?s=21', icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/> },
  { label: 'Instagram', href: 'https://www.instagram.com/frankosaigie?igsh=dXZmNGtydGs4eTdl&utm_source=qr', icon: <><rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2" stroke="currentColor" fill="none"/><circle cx="12" cy="12" r="5" strokeWidth="2" stroke="currentColor" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></> },
]

/* ═══ FOUNDER ROLES ═══ */
const founderRoles = [
  'Chemical Engineering Student',
  'Self-Taught ML Engineer',
  'Software Developer',
  'Building in Public',
]

/* ═══ MAIN EXPORT ═══ */
export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{ background: 'rgba(3,7,18,0.92)' }}
    >

      {/* ── 1. OPENING — typewriter headline ── */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold"
              style={{ color: 'rgba(34,211,238,0.6)', fontFamily: "'Sora', sans-serif" }}>
              <span className="w-8 h-px" style={{ background: 'rgba(34,211,238,0.4)' }} />
              About
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-8"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            <Typewriter
              text="We don't build AI for the future. We build it for right now."
              className="text-white"
              speed={30}
            />
          </h2>

          <ScrollRevealText
            text="Africa does not have the luxury of waiting for AI to mature. Hospitals lose vaccines to power cuts. Students build projects without guidance. Industries run blind. ChemXAI is the answer that cannot wait."
            className="max-w-2xl text-base md:text-lg leading-relaxed"
          />
        </div>
      </div>

      {/* ── 2. MISSION + METRICS — mixed entrance directions ── */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FlipIn direction="left">
            <span className="text-xs tracking-widest uppercase font-semibold mb-4 block"
              style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}>Mission</span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              AI for the people<br />
              <span style={{ color: 'rgba(34,211,238,0.8)' }}>who need it most.</span>
            </h3>
            <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.6)' }}>
              <p>
                ChemXAI was born out of a specific frustration: the most powerful AI tools
                in the world were being built for markets that already had everything.
                Meanwhile, a Nigerian hospital was managing generator fuel on a whiteboard.
              </p>
              <p>
                We build <span className="text-white font-medium">intelligent systems</span> —
                not dashboards, not chatbots — systems that make decisions, predict failures,
                and automate the workflows that keep critical environments alive.
              </p>
              <p>
                The target is not Silicon Valley. The target is every hospital,
                school, and factory that has been told AI is "not for them yet."
              </p>
            </div>
          </FlipIn>

          <FlipIn direction="right" delay={0.15}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 3, label: 'Products Shipped' },
                { val: 5, label: 'Industries Reached' },
                { val: 1, label: 'Founding Engineer' },
                { val: 24, suffix: '/7', label: 'Monitoring Active' },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
                  whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                  viewport={VP}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  className="p-6 rounded-xl group cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    transition: 'border-color 0.3s, background 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)'; e.currentTarget.style.background = 'rgba(34,211,238,0.03)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                >
                  <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                    <Counter target={s.val} suffix={s.suffix || ''} />
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(148,163,184,0.45)' }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </FlipIn>
        </div>
      </div>

      {/* ── 3. FOUNDER — photo slides from left, text from right ── */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">

          {/* photo */}
          <motion.div
            initial={{ opacity: 0, x: -80, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={VP}
            transition={{ duration: 1, ease: EASE }}
            className="lg:col-span-2 flex justify-center"
            style={{ perspective: 1200 }}
          >
            <div className="relative w-full" style={{ maxWidth: 340, aspectRatio: '3/4' }}>
              <img
                src="/founder.png"
                alt="Okoh Frank Osaigie — Founder, ChemXAI"
                className="w-full h-full object-cover object-top rounded-2xl"
                style={{ filter: 'brightness(0.9) contrast(1.05)' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(3,7,18,0.95) 0%, transparent 50%)' }} />
            </div>
          </motion.div>

          {/* text */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="lg:col-span-3 flex flex-col gap-5"
          >
            <span className="text-xs tracking-widest uppercase font-semibold"
              style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}>Founder</span>

            <div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mb-2"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Okoh Frank Osaigie
              </h3>
              <div className="flex flex-wrap gap-2">
                {founderRoles.map((role, i) => (
                  <motion.span key={role}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(148,163,184,0.65)' }}>
                    {role}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="pl-4" style={{ borderLeft: '2px solid rgba(34,211,238,0.3)' }}>
              <p className="text-slate-300 text-base leading-relaxed italic font-light">
                "With open access to the full power of AI automation for businesses,
                startups, and the underserved across the world, ChemXAI will be that
                final push towards technological advancement."
              </p>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.5)' }}>
              A Chemical Engineering student at university by day, a machine learning
              engineer and software developer by necessity. ChemXAI is not a side project —
              it is the outcome of watching real engineering problems go unsolved because
              the right intelligence did not exist yet.
            </p>

            {/* social icons — bold circled, no labels */}
            <div className="flex items-center gap-3 pt-1">
              {socials.map((s, i) => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VP}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08, type: 'spring', stiffness: 300 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: 'rgba(148,163,184,0.6)',
                    transition: 'border-color 0.25s, color 0.25s, background 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#22d3ee'; e.currentTarget.style.color = '#22d3ee'; e.currentTarget.style.background = 'rgba(34,211,238,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(148,163,184,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  aria-label={s.label}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── 4. VALUES — "How we operate" with staggered 3D flip cards ── */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, rotateX: 40, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-12"
            style={{ perspective: 1000 }}
          >
            <span className="text-xs tracking-widest uppercase font-semibold mb-3 block"
              style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}>Principles</span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              How we operate.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((v, i) => {
              const dir = i % 2 === 0 ? 'left' : 'right'
              return (
                <FlipIn key={v.num} delay={i * 0.1} direction={dir}>
                  <div className="p-7 rounded-2xl h-full group cursor-default"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      transition: 'border-color 0.3s, transform 0.3s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.15)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold" style={{ color: 'rgba(34,211,238,0.4)', fontFamily: "'Sora', sans-serif" }}>{v.num}</span>
                      <h4 className="font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{v.title}</h4>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.5)' }}>{v.desc}</p>
                  </div>
                </FlipIn>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 5. TIMELINE — alternating slide directions, glowing dots ── */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-12"
          >
            <span className="text-xs tracking-widest uppercase font-semibold mb-3 block"
              style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}>Timeline</span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              How we got here.
            </h3>
          </motion.div>

          <div>
            {milestones.map((m, i) => (
              <TimelineNode key={i} milestone={m} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. DIFFERENTIATORS — slide in from alternating sides ── */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <span className="text-xs tracking-widest uppercase font-semibold mb-3 block"
              style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}>Differentiation</span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Why ChemXAI is different.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.num}
                initial={{ opacity: 0, x: i === 0 ? -60 : i === 2 ? 60 : 0, y: i === 1 ? 60 : 0, rotateY: i === 0 ? -20 : i === 2 ? 20 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0 }}
                viewport={VP}
                transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
                className="p-8 rounded-2xl group cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  perspective: 1200,
                  transition: 'border-color 0.3s, transform 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.15)'; e.currentTarget.style.transform = 'translateY(-6px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div className="text-5xl font-extrabold mb-4 leading-none"
                  style={{ color: 'rgba(255,255,255,0.04)', fontFamily: "'Sora', sans-serif" }}>{d.num}</div>
                <h4 className="text-white font-bold text-base mb-3 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{d.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.45)' }}>{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 7. CLOSING CTA — scale up from tiny ── */}
      <div className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VP}
            transition={{ duration: 0.9, ease: EASE }}
            className="flex flex-col items-center gap-6"
          >
            <span className="text-xs tracking-widest uppercase font-semibold"
              style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}>What comes next</span>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              We are just<br />
              <span style={{ color: 'rgba(34,211,238,0.85)' }}>getting started.</span>
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.45)', maxWidth: 460 }}>
              More products. More industries. More underserved communities with access
              to the full power of intelligent automation.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center pt-2">
              <a href="#contact"
                className="px-7 py-3 rounded-full text-sm font-semibold active:scale-95"
                style={{ background: '#22d3ee', color: '#020617', transition: 'transform 0.15s' }}>
                Work With Us
              </a>
              <a href="#products"
                className="px-7 py-3 rounded-full text-sm font-semibold active:scale-95"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', transition: 'transform 0.15s' }}>
                See Our Products
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
