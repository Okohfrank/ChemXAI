import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import NeuralHead from './NeuralHead'

// ─── Background node animation ───────────────────────────────────
function HeroBg() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const COUNT = 38
    const nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
    }))
    const FRAME_MS = 1000 / 30
    let last = 0
    function draw(ts) {
      raf = requestAnimationFrame(draw)
      if (ts - last < FRAME_MS) return
      last = ts
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0
      })
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 130) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(34,211,238,${(0.07 * (1 - d / 130)).toFixed(3)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(56,189,248,0.28)'
        ctx.fill()
      })
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
}

// ─── Marquee logos ────────────────────────────────────────────────
function AiLogo() {
  return <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: '-0.05em', color: '#fff' }}>AI</span>
}
function TwitterBirdLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
    </svg>
  )
}
function GoogleLogo() {
  return <span style={{ fontWeight: 500, fontSize: 14 }}>Google</span>
}
function XLogo() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}
function LinkedInLogo() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
function GitHubLogo() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.775.417-1.305.76-1.605-2.665-.305-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.125-.305-.535-1.535.115-3.2 0 0 1.005-.322 3.3 1.23a11.51 11.51 0 013.005-.405c1.02.005 2.045.138 3.005.405 2.28-1.552 3.285-1.23 3.285-1.23.655 1.665.245 2.895.12 3.2.77.84 1.235 1.91 1.235 3.22 0 4.605-2.805 5.625-5.475 5.92.43.37.815 1.1.815 2.22 0 1.605-.015 2.9-.015 3.295 0 .32.21.695.825.575C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
function EngineeringLogo() {
  return (
    <span className="flex items-center gap-1.5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
      <span style={{ fontWeight: 600, fontSize: 13 }}>engineering</span>
    </span>
  )
}
function ChemXAIMarqueeLogo() {
  return (
    <span className="flex items-center gap-1.5">
      <svg width="12" height="14" viewBox="0 0 14 18" fill="#22d3ee">
        <path d="M8 0L1 9h5L4 18l9-11H8L8 0z"/>
      </svg>
      <span style={{ fontWeight: 700, fontSize: 13 }}>
        <span style={{ color: '#fff' }}>Chem</span>
        <span style={{ color: '#22d3ee' }}>XAI</span>
      </span>
    </span>
  )
}

const MARQUEE = [
  { key: 'ai',          Node: AiLogo },
  { key: 'twitter',     Node: TwitterBirdLogo },
  { key: 'google',      Node: GoogleLogo },
  { key: 'x',           Node: XLogo },
  { key: 'linkedin',    Node: LinkedInLogo },
  { key: 'github',      Node: GitHubLogo },
  { key: 'engineering', Node: EngineeringLogo },
  { key: 'chemxai',     Node: ChemXAIMarqueeLogo },
]

// ─── Hero ─────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      id="vision"
      className="relative overflow-hidden"
      style={{
        height: '100vh',
        background:
          'radial-gradient(ellipse 80% 50% at 50% 85%, rgba(8,42,52,0.45) 0%, transparent 70%),' +
          'radial-gradient(ellipse 60% 40% at 50% 90%, rgba(6,60,72,0.20) 0%, transparent 60%),' +
          'linear-gradient(180deg, #010408 0%, #020810 40%, #03101a 70%, #010509 100%)',
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(56,189,248,0.022) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          zIndex: 0,
        }}
      />

      {/* Animated node connections */}
      <HeroBg />

      {/* Subtle top-left teal whisper */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ width: '45vw', height: '40vh', background: 'radial-gradient(ellipse at top left, rgba(8,80,100,0.12) 0%, transparent 60%)', zIndex: 1 }} />

      {/* HEAD — absolute background */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute" style={{ inset: '5% 12%', background: 'radial-gradient(ellipse 58% 62% at 50% 52%, rgba(4,32,48,0.50) 0%, rgba(3,18,32,0.18) 52%, transparent 72%)', filter: 'blur(36px)' }} />
        <div className="absolute" style={{ inset: '10% 18%', background: 'radial-gradient(ellipse 48% 50% at 50% 50%, rgba(6,68,82,0.08) 0%, rgba(4,48,62,0.03) 55%, transparent 72%)', filter: 'blur(22px)' }} />
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -48%)',
            width: 'clamp(700px, 130vw, 1400px)',
            height: '80vh',
          }}
        >
          <NeuralHead />
        </div>
      </div>

      {/* TEXT — clears navbar */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center text-center px-6"
        style={{ top: 0, zIndex: 10, paddingTop: 'clamp(7.5rem, 13vh, 9rem)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-white/[0.04] px-4 py-1.5 text-[10.5px] uppercase tracking-[0.3em] text-cyan-300/90 font-medium"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <span className="font-mono text-cyan-400/60">&lt;&gt;</span>
          Developed for Africa
          <span className="font-mono text-cyan-400/60">&lt;&gt;</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.78 }}
          className="mt-4 max-w-3xl font-black tracking-tight leading-[1.1] text-white"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
        >
          ChemXAI: Building intelligent systems
          <br className="hidden sm:block" />
          {' '}for industry and healthcare.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.72 }}
          className="mt-3 max-w-md text-xs md:text-[15px] leading-6 md:leading-7 text-slate-400/85"
        >
          Accelerating the future through predictive analytics, energy
          optimization, and autonomous workflow tools.
        </motion.p>
      </div>

      {/* BUTTONS — pulled close to marquee, ~74% down */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.68 }}
        className="absolute left-0 right-0 flex items-center justify-center gap-3 px-6"
        style={{ top: '74%', zIndex: 10 }}
      >
        <a
          href="#products"
          className="inline-flex items-center justify-center rounded-full font-semibold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-95 px-5 py-2 text-xs md:px-7 md:py-2.5 md:text-sm"
          style={{
            background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
            boxShadow: '0 10px 36px -12px rgba(34,211,238,0.70)',
          }}
        >
          Explore Products
        </a>
        <a
          href="#vision"
          className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.06] font-semibold text-white/90 transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5 active:scale-95 px-5 py-2 text-xs md:px-7 md:py-2.5 md:text-sm"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          Our Vision
        </a>
      </motion.div>

      {/* MARQUEE — pinned to bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ zIndex: 10, background: 'rgba(1,5,9,0.88)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="marquee-ltr-wrapper">
          <div className="marquee-ltr-track flex items-center gap-10 py-3 px-4 text-slate-300/60">
            {[...MARQUEE, ...MARQUEE].map(({ key, Node }, i) => (
              <div key={`${key}-${i}`} className="flex items-center gap-2 whitespace-nowrap transition-colors duration-300 hover:text-slate-200">
                <Node />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
