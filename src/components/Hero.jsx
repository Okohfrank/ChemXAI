import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const SocialIcons = {
  GitHub: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.775.417-1.305.76-1.605-2.665-.305-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.125-.305-.535-1.535.115-3.2 0 0 1.005-.322 3.3 1.23a11.51 11.51 0 013.005-.405c1.02.005 2.045.138 3.005.405 2.28-1.552 3.285-1.23 3.285-1.23.655 1.665.245 2.895.12 3.2.77.84 1.235 1.91 1.235 3.22 0 4.605-2.805 5.625-5.475 5.92.43.37.815 1.1.815 2.22 0 1.605-.015 2.9-.015 3.295 0 .32.21.695.825.575C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  X: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  ),
  Instagram: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  WhatsApp: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
}

const marqueeItems = [
  { Icon: SocialIcons.GitHub, label: 'GitHub' },
  { Icon: SocialIcons.X, label: 'X (Twitter)' },
  { Icon: SocialIcons.Instagram, label: 'Instagram' },
  { Icon: SocialIcons.WhatsApp, label: 'WhatsApp' },
  { Icon: SocialIcons.LinkedIn, label: 'LinkedIn' },
]

const headStats = [
  { label: 'Sensors', value: '88%' },
  { label: 'Predict', value: '76%' },
  { label: 'Optimize', value: '81%' },
  { label: 'Deploy', value: '69%' },
]

const headParticles = [
  { top: '12%', left: '16%', tx: '-18px', ty: '-24px', delay: 0.1 },
  { top: '22%', left: '72%', tx: '18px', ty: '-18px', delay: 0.14 },
  { top: '36%', left: '40%', tx: '-24px', ty: '18px', delay: 0.08 },
  { top: '44%', left: '22%', tx: '-18px', ty: '22px', delay: 0.18 },
  { top: '16%', left: '54%', tx: '24px', ty: '-26px', delay: 0.2 },
  { top: '60%', left: '62%', tx: '24px', ty: '16px', delay: 0.12 },
  { top: '50%', left: '34%', tx: '-30px', ty: '-14px', delay: 0.16 },
  { top: '68%', left: '48%', tx: '14px', ty: '28px', delay: 0.22 },
]

function GridLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="gl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.18)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </radialGradient>
      </defs>
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * 360
        const rad = (angle * Math.PI) / 180
        const x2 = 50 + Math.cos(rad) * 65
        const y2 = 50 + Math.sin(rad) * 65
        return (
          <motion.line
            key={i}
            x1="50%"
            y1="50%"
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke="url(#gl)"
            strokeWidth="0.5"
            animate={{ opacity: [0.14, 0.46, 0.14] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </svg>
  )
}

function HeadGraphic() {
  return (
    <div className="head-card relative overflow-hidden rounded-[42px] bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-cyan-950/10 shadow-[0_36px_120px_-42px_rgba(34,211,238,0.92)] border border-cyan-400/10">
      <div className="head-card-grid absolute inset-0 opacity-60" />
      <div className="head-card-panel absolute inset-x-6 top-5 bottom-9 rounded-[32px] border border-cyan-300/10 bg-slate-950/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]" />
      <div className="relative z-10 p-7 flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-cyan-200 font-semibold">
              AI MATRIX
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white">Neural control core</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              A premium AI console for process design, lab automation, and predictive diagnostics.
            </p>
          </div>
          <div className="rounded-3xl border border-cyan-400/10 bg-slate-950/70 px-4 py-3 text-xs uppercase tracking-[0.26em] text-cyan-200 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.72)]">
            Live
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/90 p-5 shadow-[0_30px_80px_-34px_rgba(0,0,0,0.82)]">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cyan-400/15 to-transparent" />
          <div className="relative flex items-center justify-between gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">System load</span>
              <div className="mt-2 text-3xl font-black text-white">87<span className="text-sm font-medium">%</span></div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              Throughput
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {headStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300">
                <div className="uppercase tracking-[0.24em] text-slate-400 mb-2">{stat.label}</div>
                <div className="text-lg font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[28px] border border-cyan-400/15 bg-slate-950/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Processing queue</div>
            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-200">
              <span>Batch #0321</span>
              <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-cyan-200">42ms</span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-between gap-4 rounded-[32px] border border-cyan-400/10 bg-slate-950/70 px-4 py-3 text-slate-300 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.82)]">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.24em] text-cyan-400/80">Integrated core</span>
            <span className="text-sm font-semibold text-white">Quantum pipeline</span>
          </div>
          <div className="rounded-2xl bg-cyan-400/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Active</div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  const [ready, setReady] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 120)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={ref}
      id="vision"
      className="relative min-h-screen overflow-hidden pt-24 pb-10"
      style={{
        background: 'radial-gradient(circle at 20% 18%, rgba(34,211,238,0.08) 0%, transparent 24%), linear-gradient(180deg, #05070f 0%, #02040b 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(56,189,248,0.07) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_34%)] opacity-90 pointer-events-none" />
      <GridLines />

      <motion.div style={{ y, opacity }} className="relative z-20 flex flex-col items-center text-center px-6 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-cyan-200"
        >
          Elite AI chemistry
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.8 }}
          className="mt-8 max-w-4xl text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-50"
        >
          Premium predictive intelligence
          <br />
          for chemical engineering and lab automation.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.75 }}
          className="mt-6 max-w-2xl text-sm md:text-base leading-7 text-slate-400"
        >
          ChemXAI combines computational modeling, adaptive workflows, and enterprise-grade analytics into a polished platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href="#products"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_60px_-28px_rgba(34,211,238,0.85)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            View Product Suite
          </a>
          <a
            href="#vision"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Discover Vision
          </a>
        </motion.div>
      </motion.div>

      <div className="relative mx-auto mt-[-40px] flex w-full max-w-6xl justify-center px-6 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.95, ease: 'easeOut' }}
          className="relative w-full max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-[52px] border border-white/10 bg-slate-950/80 shadow-[0_40px_100px_-42px_rgba(0,0,0,0.9)]">
            <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-cyan-400/15 to-transparent" />
            <div className="relative px-6 pb-10 pt-8 sm:px-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-cyan-200">
                    AI HUB
                  </div>
                  <div className="text-2xl font-semibold tracking-tight text-slate-100">Station X</div>
                  <p className="max-w-xl text-sm text-slate-400">A premium laptop-style console showing the ChemXAI core with floating holographic diagnostics.</p>
                </div>
                <div className="space-y-2 rounded-3xl border border-white/10 bg-slate-950/75 px-4 py-3 text-xs text-slate-300 shadow-[0_16px_48px_-30px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400 uppercase tracking-[0.24em]">Status</span>
                    <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-cyan-200">Online</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400 uppercase tracking-[0.24em]">AI mode</span>
                    <span className="font-semibold text-slate-100">Autonomous</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto px-6 pb-8 sm:px-10">
              <div className="relative mx-auto mt-6 w-full max-w-4xl">
                <div className="relative rounded-[42px] border border-cyan-400/10 bg-slate-950/95 p-5 shadow-[0_28px_80px_-34px_rgba(0,0,0,0.75)]">
                  <div className="absolute -left-14 top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
                  <div className="absolute -right-16 top-16 h-48 w-48 rounded-full bg-sky-500/5 blur-3xl" />
                  <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/95 px-5 py-5 sm:px-6 sm:py-6">
                    {ready && <HeadGraphic />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-8 w-full max-w-6xl overflow-hidden rounded-full border border-white/10 bg-slate-950/72 px-4 py-2 shadow-[0_24px_90px_-54px_rgba(0,0,0,0.9)]">
        <div className="marquee-wrapper">
          <div className="marquee-track py-3 flex items-center gap-10 text-sm text-slate-300 font-medium">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex items-center gap-3 whitespace-nowrap text-slate-300 transition-colors duration-300 hover:text-cyan-300">
                <item.Icon />
                <span className="uppercase tracking-[0.24em] text-slate-300/90 text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
