import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]
const VP = { once: false, amount: 0.15 }

/* ═══ BENTO CARD ═══ */
function BentoCard({ children, className = '', delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'border-color 0.35s, transform 0.35s',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(34,211,238,0.15)'
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {children}
    </motion.div>
  )
}

/* ═══ INTERACTIVE PYTHON PLAYGROUND ═══
   Lazy-loads Skulpt from CDN only on first Run click (zero initial cost).
   Subsequent runs are instant.                                            */

const DEFAULT_CODE = `# ChemXAI Python Playground
# Edit this code and click Run!

import random

print("=== PULSE Energy Sim ===")
print("")

# Simulate generator status
for i in range(3):
    name = "Gen-" + str(i + 1)
    fuel = random.randint(15, 95)
    bar = "#" * (fuel // 10)
    if fuel < 30:
        tag = "LOW"
    elif fuel < 60:
        tag = "OK"
    else:
        tag = "GOOD"
    print(name + " [" + bar + "] " + str(fuel) + "% " + tag)

print("")

# Vaccine fridge
temp = random.randint(20, 85)
temp = temp / 10.0
print("Vaccine Fridge: " + str(temp) + " C")
if temp > 8:
    print("ALERT: Too warm!")
else:
    print("All clear.")

print("")

# Prediction
hrs = random.randint(1, 12)
print("Next outage: ~" + str(hrs) + " hours")
print("=== Sim Complete ===")
`

function PythonPlayground() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadSkulpt = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.Sk) { resolve(); return }
      setLoading(true)
      const s1 = document.createElement('script')
      s1.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js'
      s1.onload = () => {
        const s2 = document.createElement('script')
        s2.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js'
        s2.onload = () => { setLoading(false); resolve() }
        s2.onerror = () => { setLoading(false); reject(new Error('Failed to load Python stdlib')) }
        document.head.appendChild(s2)
      }
      s1.onerror = () => { setLoading(false); reject(new Error('Failed to load Python engine')) }
      document.head.appendChild(s1)
    })
  }, [])

  const runCode = useCallback(async () => {
    setRunning(true)
    setOutput('')
    try {
      await loadSkulpt()

      let out = ''
      window.Sk.configure({
        output: (text) => { out += text },
        read: (filename) => {
          if (window.Sk.builtinFiles && window.Sk.builtinFiles.files[filename]) {
            return window.Sk.builtinFiles.files[filename]
          }
          throw new Error('File not found: ' + filename)
        },
      })

      await window.Sk.misceval.asyncToPromise(() =>
        window.Sk.importMainWithBody('<stdin>', false, code, true)
      )

      setOutput(out || '(no output)')
    } catch (err) {
      const msg = err.toString ? err.toString() : String(err)
      setOutput('Error: ' + msg)
    }
    setRunning(false)
  }, [code, loadSkulpt])

  const handleKeyDown = useCallback((e) => {
    // Tab inserts 4 spaces instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.target
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4
      })
    }
  }, [code])

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="text-[10px] tracking-wider"
          style={{ color: 'rgba(148,163,184,0.35)', fontFamily: "'Sora', sans-serif" }}>
          python playground
        </span>
        <button
          onClick={runCode}
          disabled={running}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer"
          style={{
            background: running ? 'rgba(34,211,238,0.08)' : 'rgba(34,211,238,0.12)',
            color: '#22d3ee',
            border: '1px solid rgba(34,211,238,0.2)',
            fontFamily: "'Sora', sans-serif",
            transition: 'background 0.2s',
          }}
        >
          {running ? (
            loading ? 'Loading...' : 'Running...'
          ) : (
            <>
              <svg width="8" height="10" viewBox="0 0 8 10" fill="#22d3ee"><polygon points="0,0 8,5 0,10"/></svg>
              Run
            </>
          )}
        </button>
      </div>

      {/* Code editor */}
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="w-full outline-none resize-none block"
        style={{
          background: 'rgba(6,10,20,0.85)',
          color: '#e2e8f0',
          padding: '14px 16px',
          minHeight: 200,
          border: 'none',
          lineHeight: 1.7,
          tabSize: 4,
          fontSize: 12,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
        }}
      />

      {/* Output panel */}
      {(output || running) && (
        <div className="px-4 py-3"
          style={{
            background: 'rgba(3,6,14,0.9)',
            borderTop: '1px solid rgba(34,211,238,0.08)',
            maxHeight: 180,
            overflowY: 'auto',
          }}>
          <pre className="text-xs whitespace-pre-wrap m-0"
            style={{
              color: output.startsWith('Error') ? '#ef4444' : '#34d399',
              lineHeight: 1.7,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            }}>
            {running
              ? (loading ? 'Loading Python engine...' : 'Executing...')
              : output}
          </pre>
        </div>
      )}
    </div>
  )
}

/* ═══ PROCESS FLOW ═══ */
const steps = [
  { label: 'Collect', desc: 'Sensors & edge devices gather real-time data' },
  { label: 'Process', desc: 'Clean, normalize & feature-engineer on device' },
  { label: 'Predict', desc: 'ML models forecast failures & anomalies' },
  { label: 'Act', desc: 'Automated alerts, reports & interventions' },
]

/* ═══ TECH STACK — simple colored pills, no heavy SVGs ═══ */
const stack = [
  { name: 'Python', color: '#3776AB' },
  { name: 'TensorFlow', color: '#FF6F00' },
  { name: 'React', color: '#61DAFB' },
  { name: 'Node.js', color: '#339933' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Docker', color: '#2496ED' },
]

/* ═══ MAIN EXPORT ═══ */
export default function Technology() {
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true, margin: '-80px' })

  const headingLines = [
    { text: 'The intelligence', style: { color: '#fff' } },
    { text: 'behind every', style: { color: '#fff' } },
    { text: 'system.', style: { color: '#22d3ee' } },
  ]

  return (
    <section
      id="technology"
      className="relative overflow-hidden py-20 md:py-32 px-4 md:px-6"
      style={{ background: 'rgba(3,7,18,0.92)' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <div ref={headerRef} className="mb-12 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-5"
            style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}
          >
            <span className="w-8 h-px" style={{ background: 'rgba(34,211,238,0.4)' }} />
            Technology
          </motion.span>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {headingLines.map((line, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.08 + i * 0.1, ease: EASE }}
                style={line.style}
              >
                {line.text}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 max-w-xl text-sm md:text-base leading-relaxed"
            style={{ color: 'rgba(148,163,184,0.5)' }}
          >
            Built for the hardest environments on earth — unreliable power, intermittent
            connectivity, constrained hardware. Our stack turns sensor noise into decisions.
          </motion.p>
        </div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-10 md:mb-14">

          {/* Large card — Intelligent Pipeline */}
          <BentoCard className="md:row-span-2" delay={0}>
            <div className="p-5 md:p-8 h-full flex flex-col">
              <span className="text-[10px] font-bold tracking-widest uppercase mb-3"
                style={{ color: 'rgba(34,211,238,0.35)', fontFamily: "'Sora', sans-serif" }}>Core</span>

              <h3 className="text-lg md:text-2xl font-extrabold text-white tracking-tight mb-2"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Intelligent Pipeline
              </h3>
              <p className="text-xs md:text-sm leading-relaxed mb-5" style={{ color: 'rgba(148,163,184,0.5)' }}>
                End-to-end ML pipeline built for unreliable infrastructure — sensor ingestion,
                anomaly detection, predictive modeling, and automated alerting.
              </p>

              {/* pipeline steps */}
              <div className="flex-1 flex flex-col justify-end gap-2">
                {['Data Ingestion', 'Feature Engineering', 'Model Inference', 'Action & Alerts'].map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VP}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.07, ease: EASE }}
                    className="flex items-center gap-3 px-3 py-2 md:px-4 md:py-2.5 rounded-lg"
                    style={{
                      background: 'rgba(34,211,238,0.03)',
                      borderLeft: `2px solid rgba(34,211,238,${0.15 + i * 0.1})`,
                    }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: 'rgba(34,211,238,0.3)' }}>0{i + 1}</span>
                    <span className="text-xs font-medium text-white">{label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Edge Computing */}
          <BentoCard delay={0.08}>
            <div className="p-5 md:p-8">
              <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block"
                style={{ color: 'rgba(34,211,238,0.35)', fontFamily: "'Sora', sans-serif" }}>Edge</span>
              <h3 className="text-base md:text-lg font-bold text-white tracking-tight mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                Edge Inference
              </h3>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.5)' }}>
                Compressed models deployed directly to monitoring hardware. Real-time predictions
                without depending on cloud connectivity or stable internet.
              </p>
            </div>
          </BentoCard>

          {/* Predictive Analytics */}
          <BentoCard delay={0.16}>
            <div className="p-5 md:p-8">
              <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block"
                style={{ color: 'rgba(34,211,238,0.35)', fontFamily: "'Sora', sans-serif" }}>ML</span>
              <h3 className="text-base md:text-lg font-bold text-white tracking-tight mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                Predictive Analytics
              </h3>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.5)' }}>
                Time-series forecasting tuned for African infrastructure patterns — NEPA outage
                cycles, generator degradation curves, biometric crisis signatures.
              </p>
            </div>
          </BentoCard>
        </div>

        {/* ── PYTHON PLAYGROUND ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-white tracking-tight"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Try it yourself.
              </h3>
              <p className="text-[11px] md:text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>
                Write and run Python code in your browser.
              </p>
            </div>
          </div>
          <PythonPlayground />
        </motion.div>

        {/* ── PROCESS FLOW ── */}
        <div className="mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              How data becomes intelligence.
            </h3>
            <p className="text-[11px] md:text-xs mt-1" style={{ color: 'rgba(148,163,184,0.4)' }}>
              Four stages. Zero human intervention required.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.08, ease: EASE }}
                className="relative p-4 md:p-5 rounded-xl text-center"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(34,211,238,0.12)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'}
              >
                <span className="absolute top-2 right-2.5 text-[10px] font-bold"
                  style={{ color: 'rgba(34,211,238,0.18)', fontFamily: "'Sora', sans-serif" }}>
                  0{i + 1}
                </span>
                <h4 className="text-sm font-bold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {step.label}
                </h4>
                <p className="text-[10px] md:text-[11px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.4)' }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── TECH STACK — clean pills with colored dots ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-4"
            style={{ color: 'rgba(34,211,238,0.4)', fontFamily: "'Sora', sans-serif" }}>
            Built with
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {stack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VP}
                transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'border-color 0.25s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${tech.color}40`}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tech.color }} />
                <span className="text-[11px] font-semibold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
