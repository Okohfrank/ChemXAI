import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

const EASE = [0.22, 1, 0.36, 1]
const VP = { once: false, amount: 0.15 }

/* ═══ ANIMATED INPUT ═══ */
function FloatingInput({ label, type = 'text', name, value, onChange, textarea = false }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div className="relative">
      <Tag
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent text-white text-sm outline-none peer"
        style={{
          padding: textarea ? '20px 0 8px' : '20px 0 8px',
          borderBottom: `1px solid ${focused ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.08)'}`,
          transition: 'border-color 0.3s',
          resize: textarea ? 'none' : undefined,
          minHeight: textarea ? 100 : undefined,
          fontFamily: "'DM Sans', sans-serif",
        }}
        autoComplete="off"
      />
      <span
        className="absolute left-0 pointer-events-none font-medium"
        style={{
          top: active ? 0 : 16,
          fontSize: active ? 10 : 14,
          color: focused ? 'rgba(34,211,238,0.6)' : 'rgba(148,163,184,0.35)',
          transition: 'all 0.25s ease',
          fontFamily: "'Sora', sans-serif",
          letterSpacing: active ? '0.05em' : '0',
        }}
      >
        {label}
      </span>
    </div>
  )
}

/* ═══ SOCIAL ICONS ═══ */
const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/chemxai?igsh=YW9yMDhkdTdrOTEw&utm_source=qr', icon: <><rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2" stroke="currentColor" fill="none"/><circle cx="12" cy="12" r="5" strokeWidth="2" stroke="currentColor" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></> },
]

/* ═══ FOOTER LINKS ═══ */
const footerLinks = ['Products', 'About', 'Vision', 'Technology', 'Contact']

/* ═══ MAIN EXPORT ═══ */
export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    // mailto fallback — works everywhere, no backend needed
    const subject = encodeURIComponent(form.subject || `Message from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )
    window.location.href = `mailto:officialchemxai@gmail.com?subject=${subject}&body=${body}`
    setStatus('sent')
    setTimeout(() => setStatus('idle'), 4000)
  }

  const handleNav = (e, section) => {
    e.preventDefault()
    const hash = '#' + section.toLowerCase()
    if (location.pathname === '/') {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/' + hash)
    }
  }

  const headingLines = [
    { text: "Let's build", style: { color: '#fff' } },
    { text: 'something', style: { color: '#fff' } },
    { text: 'together.', style: { color: '#22d3ee' } },
  ]

  return (
    <footer
      id="contact"
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(3,7,18,0.92) 0%, #010509 100%)' }}
    >
      {/* ── CONTACT SECTION ── */}
      <div ref={ref} className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* LEFT — info */}
            <div>
              <motion.span
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE }}
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-5 block"
                style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}
              >
                <span className="w-8 h-px" style={{ background: 'rgba(34,211,238,0.4)' }} />
                Contact
              </motion.span>

              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.08] mb-6"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {headingLines.map((line, i) => (
                  <motion.span
                    key={i}
                    className="block"
                    initial={{ opacity: 0, y: 28 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.06 + i * 0.1, ease: EASE }}
                    style={line.style}
                  >
                    {line.text}
                  </motion.span>
                ))}
              </h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-sm md:text-base leading-relaxed mb-8"
                style={{ color: 'rgba(148,163,184,0.5)' }}
              >
                Whether you want to deploy AI in your hospital, collaborate on research,
                or discuss custom solutions for your industry — we're listening.
              </motion.p>

              {/* contact details */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-col gap-4 mb-8"
              >
                {/* email */}
                <a href="mailto:officialchemxai@gmail.com"
                  className="flex items-center gap-3 group"
                  style={{ color: 'rgba(148,163,184,0.6)', transition: 'color 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#22d3ee'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.6)'}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(34,211,238,0.06)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M22 4L12 13 2 4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">officialchemxai@gmail.com</p>
                    <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.35)' }}>Preferred contact</p>
                  </div>
                </a>

                {/* location */}
                <div className="flex items-center gap-3" style={{ color: 'rgba(148,163,184,0.5)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(34,211,238,0.06)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Nigeria</p>
                    <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.35)' }}>Building for Africa, from Africa</p>
                  </div>
                </div>

                {/* availability */}
                <div className="flex items-center gap-3" style={{ color: 'rgba(148,163,184,0.5)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(34,211,238,0.06)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Open to work</p>
                    <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.35)' }}>Partnerships, contracts & collaborations</p>
                  </div>
                </div>
              </motion.div>

              {/* social icons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="flex items-center gap-3"
              >
                {socials.map((s, i) => (
                  <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.6 + i * 0.06, type: 'spring', stiffness: 300 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(148,163,184,0.5)',
                      transition: 'border-color 0.25s, color 0.25s, background 0.25s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#22d3ee'
                      e.currentTarget.style.color = '#22d3ee'
                      e.currentTarget.style.background = 'rgba(34,211,238,0.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.color = 'rgba(148,163,184,0.5)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    }}
                    aria-label={s.label}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <FloatingInput label="Your name" name="name" value={form.name} onChange={handleChange} />
                <FloatingInput label="Email address" name="email" type="email" value={form.email} onChange={handleChange} />
                <FloatingInput label="Subject (optional)" name="subject" value={form.subject} onChange={handleChange} />
                <FloatingInput label="Your message" name="message" value={form.message} onChange={handleChange} textarea />

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 w-full md:w-auto md:self-start inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold cursor-pointer"
                  style={{
                    background: status === 'sent' ? '#34d399' : '#22d3ee',
                    color: '#020617',
                    border: 'none',
                    fontFamily: "'Sora', sans-serif",
                    transition: 'background 0.3s',
                  }}
                  disabled={status === 'sending'}
                >
                  {status === 'sent' ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="2,7 5.5,10.5 12,3.5"/>
                      </svg>
                      Message Ready
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="1" y1="7" x2="13" y2="7"/><polyline points="8,2 13,7 8,12"/>
                      </svg>
                    </>
                  )}
                </motion.button>

                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.25)' }}>
                  This will open your default email client. No data is stored on our servers.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── FOOTER BAR ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-5">

          {/* logo */}
          <a href="/"
            onClick={e => { e.preventDefault(); if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); else navigate('/') }}
            className="flex items-center gap-2 select-none"
          >
            <img src="/ChemXAI.png" alt="ChemXAI" className="h-9" style={{ objectFit: 'contain' }} />
            <span className="text-lg tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              <span style={{ color: '#fff', fontWeight: 300 }}>Chem</span>
              <span style={{ color: '#22d3ee', fontWeight: 800 }}>XAI</span>
            </span>
          </a>

          {/* links */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            {footerLinks.map(link => (
              <a key={link}
                href={`#${link.toLowerCase()}`}
                onClick={e => handleNav(e, link)}
                className="text-xs font-medium"
                style={{ color: 'rgba(148,163,184,0.4)', transition: 'color 0.25s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#22d3ee'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.4)'}
              >
                {link}
              </a>
            ))}
          </div>

          {/* copyright */}
          <p className="text-[11px]" style={{ color: 'rgba(148,163,184,0.2)' }}>
            &copy; {new Date().getFullYear()} ChemXAI
          </p>
        </div>
      </div>
    </footer>
  )
}
