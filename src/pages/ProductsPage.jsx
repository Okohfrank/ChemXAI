import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const EASE = [0.22, 1, 0.36, 1]
const VP = { once: false, amount: 0.15 }

/* ═══ TAB DATA ═══ */
const tabs = [
  { id: 'products', label: 'Products' },
  { id: 'research', label: 'Research' },
  { id: 'data', label: 'Data for Africa' },
]

/* ═══ PRODUCTS ═══ */
const products = [
  {
    name: 'PULSE',
    tagline: 'Predictive Utility & Life Support Systems',
    sector: 'Energy AI',
    status: 'Live',
    statusColor: '#34d399',
    href: 'https://pulse-chemxai.netlify.app',
    desc: 'AI-powered hospital energy intelligence. Monitors generator fuel, vaccine fridge temps, NEPA grid status, and electrical load — predicting failures before they happen.',
    features: ['Generator fuel prediction', 'NEPA grid monitoring', 'Vaccine cold chain alerts', 'Load forecasting', 'Solar ROI analysis'],
    dataAngle: 'Collects anonymized energy consumption patterns from Nigerian hospitals — NEPA outage frequency, generator runtime, fuel burn rates — providing the first structured dataset of hospital energy management in West Africa.',
  },
  {
    name: 'SORTAI',
    tagline: 'Pneumatic Waste Sorting & Computer Vision System',
    sector: 'Industrial AI',
    status: 'Live',
    statusColor: '#34d399',
    href: 'https://sortai.netlify.app/',
    desc: 'AI-powered pneumatic waste sorting system. Combines real-time computer vision and pneumatic air-jet controls to analyze and sort materials based on density, mass, moisture, and size.',
    features: ['Computer Vision analysis', 'Density & moisture estimation', 'Pneumatic air-jet control', 'Real-time simulation', 'Advanced statistics logging'],
    dataAngle: 'Gathers real-time telemetry on sorted material characteristics — mass distribution, density variances, and moisture content of municipal solid waste — building a comprehensive dataset to optimize municipal recycling programs in developing regions.',
  },
  {
    name: 'ProjexAI',
    tagline: 'Academic Intelligence Ecosystem',
    sector: 'Academic AI',
    status: 'Launching July 6',
    statusColor: '#eab308',
    href: null,
    desc: 'AI ecosystem for final year engineering students and supervisors. Finds cheapest materials, builds budgets, tracks timelines, surfaces literature, and serves as an intelligent assistant from proposal to defence day.',
    features: ['Material cost sourcing', 'Budget generation', 'Timeline management', 'Literature AI assistant', 'Defence preparation'],
    dataAngle: 'Aggregates data on best final year project practices — material costs across regions, common timelines, supervisor feedback patterns — creating the definitive resource for academic project success in Nigerian universities.',
  },
  {
    name: 'Sickle Cell Smart Watch',
    tagline: 'AI Health Intelligence System',
    sector: 'Healthcare AI',
    status: 'Prototype',
    statusColor: '#a855f7',
    href: null,
    desc: 'Wearable AI for sickle cell patients. Continuously monitors biometric signals, predicts vaso-occlusive crises before they occur, and triggers emergency protocols with sensor-driven precision.',
    features: ['Crisis prediction', 'Biometric monitoring', 'Emergency alerts', 'Sensor fusion', 'Patient history tracking'],
    dataAngle: 'With patient consent, collects continuous biometric readings from sickle cell patients — SpO2, heart rate variability, temperature, pain onset patterns — providing researchers with the richest dataset of sickle cell crisis indicators ever assembled in Africa.',
  },
]

/* ═══ RESEARCH ARTICLES ═══ */
const articles = [
  {
    title: 'Predictive Energy Management in Resource-Constrained Hospitals',
    category: 'Energy Systems',
    abstract: 'An exploration of how ML models trained on NEPA outage data and generator logs can forecast power disruptions 2-6 hours ahead, enabling preventive measures for vaccine cold chain integrity.',
    tags: ['Machine Learning', 'Energy', 'Healthcare'],
    status: 'In Progress',
  },
  {
    title: 'Wearable Biometric Intelligence for Sickle Cell Crisis Prediction',
    category: 'Health AI',
    abstract: 'Architecture and preliminary results of a multi-sensor wearable system that fuses SpO2, HRV, and skin temperature data to predict vaso-occlusive crises with clinically actionable lead times.',
    tags: ['Wearable AI', 'Biometrics', 'Sickle Cell'],
    status: 'In Progress',
  },
  {
    title: 'Data Poverty as Infrastructure Failure: A Framework for AI in Africa',
    category: 'AI Policy',
    abstract: 'Africa\'s AI gap is not a talent gap — it is a data gap. This paper proposes a model where deployed AI products double as structured data collection instruments.',
    tags: ['Data Infrastructure', 'Africa', 'Policy'],
    status: 'In Progress',
  },
  {
    title: 'Automating Academic Project Workflows with Constrained AI',
    category: 'Education AI',
    abstract: 'How ProjexAI applies LLM-based reasoning within structured constraints to guide engineering students through material sourcing, budgeting, and timeline management.',
    tags: ['Education', 'LLM', 'Automation'],
    status: 'In Progress',
  },
]

/* ═══ DATA MISSION ═══ */
const dataSectors = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    title: 'Hospital Energy Data',
    desc: 'PULSE collects anonymized data on NEPA outages, generator runtime, fuel consumption, and load patterns across Nigerian hospitals — building Africa\'s first open energy management dataset for healthcare facilities.',
    product: 'PULSE',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>,
    title: 'Industrial Waste Composition Data',
    desc: 'SORTAI collects physical telemetry on municipal waste characteristics (density, mass, moisture) during automated pneumatic sorting — generating key datasets to design optimal recycling infrastructure in Africa.',
    product: 'SORTAI',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    title: 'Sickle Cell Biometrics',
    desc: 'With patient consent, the Sickle Cell Smart Watch gathers continuous biometric readings — SpO2, heart rate, temperature, pain markers — giving researchers the data to accelerate cure development.',
    product: 'Sickle Cell Watch',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>,
    title: 'Academic Project Intelligence',
    desc: 'ProjexAI aggregates data on material costs, project timelines, supervisor patterns, and best practices — creating the definitive resource for final year project success across Nigerian universities.',
    product: 'ProjexAI',
  },
]

/* ═══ LAUNCH OVERLAY ═══ */
function LaunchOverlay({ active, name = 'PULSE', onComplete }) {
  useEffect(() => {
    if (!active) return
    const timer = setTimeout(onComplete, 2200)
    return () => clearTimeout(timer)
  }, [active, onComplete])

  const letters = name.split('')

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

/* ═══ PRODUCT DETAIL CARD ═══ */
function ProductDetail({ product, index, onLaunch }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.2 })
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="p-5 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <span className="text-[10px] md:text-xs uppercase tracking-widest font-semibold"
              style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}>{product.sector}</span>
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mt-0.5"
              style={{ fontFamily: "'Sora', sans-serif" }}>{product.name}</h3>
            <p className="text-xs md:text-sm mt-0.5" style={{ color: 'rgba(148,163,184,0.5)' }}>{product.tagline}</p>
          </div>
          <span className="text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: `${product.statusColor}15`, color: product.statusColor, fontFamily: "'Sora', sans-serif" }}>
            {product.status}
          </span>
        </div>

        <p className="text-xs md:text-sm leading-relaxed mb-5" style={{ color: 'rgba(148,163,184,0.6)' }}>{product.desc}</p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-5">
          {product.features.map((f, i) => (
            <motion.span key={f}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
              className="text-[10px] md:text-xs px-2.5 py-1 md:px-3 md:py-1.5 rounded-full"
              style={{ background: 'rgba(34,211,238,0.06)', color: 'rgba(34,211,238,0.7)' }}>
              {f}
            </motion.span>
          ))}
        </div>

        {/* Data angle - expandable */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-semibold mb-3 cursor-pointer"
          style={{ color: 'rgba(34,211,238,0.6)', fontFamily: "'Sora', sans-serif", background: 'none', border: 'none' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
            <path d="M4 2l4 4-4 4"/>
          </svg>
          Data Impact
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pl-4 pb-2" style={{ borderLeft: '2px solid rgba(34,211,238,0.2)' }}>
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.5)' }}>{product.dataAngle}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {product.href && (
          onLaunch ? (
            <button
              onClick={() => onLaunch(product.name, product.href)}
              className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-semibold active:scale-95 cursor-pointer"
              style={{ background: '#22d3ee', color: '#020617', transition: 'transform 0.15s', border: 'none' }}
            >
              Launch {product.name}
            </button>
          ) : (
            <a href={product.href} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-semibold active:scale-95"
              style={{ background: '#22d3ee', color: '#020617', transition: 'transform 0.15s' }}>
              Visit {product.name}
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="1" y1="7" x2="13" y2="7"/><polyline points="8,2 13,7 8,12"/>
              </svg>
            </a>
          )
        )}
      </div>
    </motion.div>
  )
}

/* ═══ NO RESULTS ═══ */
function NoResults({ query }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-3"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <p className="text-sm" style={{ color: 'rgba(148,163,184,0.35)' }}>
        No results for "<span className="text-white font-medium">{query}</span>"
      </p>
    </motion.div>
  )
}

/* ═══ MAIN PAGE ═══ */
export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('products')
  const [searchQuery, setSearchQuery] = useState('')
  const [launchingProduct, setLaunchingProduct] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Filter logic
  const q = searchQuery.toLowerCase().trim()
  const filteredProducts = q
    ? products.filter(p => [p.name, p.tagline, p.sector, p.desc, ...p.features].some(s => s.toLowerCase().includes(q)))
    : products
  const filteredArticles = q
    ? articles.filter(a => [a.title, a.category, a.abstract, ...a.tags].some(s => s.toLowerCase().includes(q)))
    : articles
  const filteredDataSectors = q
    ? dataSectors.filter(s => [s.title, s.desc, s.product].some(str => str.toLowerCase().includes(q)))
    : dataSectors

  const handleLaunch = useCallback((name, href) => {
    window.open(href, '_blank')
    setLaunchingProduct(name)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'rgba(3,7,18,0.92)' }}>

      {/* Launch Animation Overlay */}
      <LaunchOverlay active={!!launchingProduct} name={launchingProduct || 'PULSE'} onComplete={() => setLaunchingProduct(null)} />

      {/* Header */}
      <div className="pt-24 md:pt-32 pb-8 md:pb-12 px-5 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-xs md:text-sm mb-6 md:mb-8"
            style={{ color: 'rgba(148,163,184,0.5)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#22d3ee'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.5)'}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 3L5 8l5 5"/>
            </svg>
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="inline-flex items-center gap-2 text-[10px] md:text-xs tracking-widest uppercase font-semibold mb-3 md:mb-4"
              style={{ color: 'rgba(34,211,238,0.5)', fontFamily: "'Sora', sans-serif" }}>
              <span className="w-6 md:w-8 h-px" style={{ background: 'rgba(34,211,238,0.4)' }} />
              Explore
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Everything we're<br />
              <span style={{ color: 'rgba(34,211,238,0.85)' }}>building.</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-[60px] md:top-[72px] z-30 px-5 md:px-6" style={{ backdropFilter: 'blur(16px)', background: 'rgba(3,7,18,0.85)' }}>
        <div className="max-w-5xl mx-auto flex gap-1 py-2.5 md:py-3 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery('') }}
              className="px-3.5 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap cursor-pointer flex-shrink-0"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: activeTab === tab.id ? 'rgba(34,211,238,0.12)' : 'transparent',
                color: activeTab === tab.id ? '#22d3ee' : 'rgba(148,163,184,0.5)',
                border: activeTab === tab.id ? '1px solid rgba(34,211,238,0.25)' : '1px solid transparent',
                transition: 'all 0.25s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 md:px-6 pb-20 md:pb-24">
        <div className="max-w-5xl mx-auto pt-8 md:pt-12">

          {/* Search bar */}
          <div className="mb-6 md:mb-8">
            <div className="relative max-w-md">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase() || ''}...`}
                className="w-full pl-10 pr-10 py-2.5 md:py-3 rounded-xl text-xs md:text-sm text-white placeholder:text-slate-600 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'border-color 0.25s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.3)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(148,163,184,0.6)', border: 'none' }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* ── PRODUCTS TAB ── */}
            {activeTab === 'products' && (
              <motion.div key="products"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-xs md:text-sm leading-relaxed mb-8 md:mb-10" style={{ color: 'rgba(148,163,184,0.5)', maxWidth: 600 }}>
                  Intelligent systems solving real energy, health, and academic challenges.
                  Each product is designed to work in the hardest environments — and to generate the data Africa needs.
                </p>
                {filteredProducts.length > 0 ? (
                  <div className="flex flex-col gap-4 md:gap-6">
                    {filteredProducts.map((p, i) => (
                      <ProductDetail key={p.name} product={p} index={i} onLaunch={handleLaunch} />
                    ))}
                  </div>
                ) : (
                  <NoResults query={searchQuery} />
                )}
              </motion.div>
            )}

            {/* ── RESEARCH TAB ── */}
            {activeTab === 'research' && (
              <motion.div key="research"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-xs md:text-sm leading-relaxed mb-8 md:mb-10" style={{ color: 'rgba(148,163,184,0.5)', maxWidth: 600 }}>
                  ChemXAI publishes research at the intersection of AI systems, infrastructure, and African development.
                  Every paper is grounded in deployed systems, not theory.
                </p>
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {filteredArticles.map((a, i) => (
                      <motion.div key={a.title}
                        initial={{ opacity: 0, rotateY: i % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                        className="p-5 md:p-7 rounded-2xl group cursor-default"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          perspective: 1200,
                          transition: 'border-color 0.3s, transform 0.3s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.15)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
                      >
                        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                          <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full"
                            style={{ background: 'rgba(34,211,238,0.06)', color: 'rgba(34,211,238,0.7)', fontFamily: "'Sora', sans-serif" }}>
                            {a.category}
                          </span>
                          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(234,179,8,0.08)', color: '#eab308' }}>
                            {a.status}
                          </span>
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-white mb-2 md:mb-3 leading-snug tracking-tight"
                          style={{ fontFamily: "'Sora', sans-serif" }}>{a.title}</h4>
                        <p className="text-xs md:text-sm leading-relaxed mb-3" style={{ color: 'rgba(148,163,184,0.5)' }}>{a.abstract}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {a.tags.map(t => (
                            <span key={t} className="text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded"
                              style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(148,163,184,0.4)' }}>{t}</span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <NoResults query={searchQuery} />
                )}
              </motion.div>
            )}

            {/* ── DATA FOR AFRICA TAB ── */}
            {activeTab === 'data' && (
              <motion.div key="data"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Mission statement */}
                <div className="mb-10 md:mb-12">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3 md:mb-4"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    Solving data poverty, <span style={{ color: 'rgba(34,211,238,0.85)' }}>one product at a time.</span>
                  </h2>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.55)', maxWidth: 650 }}>
                    Africa's biggest AI barrier is not talent — it is data. There are no structured datasets for hospital energy management in Nigeria.
                    No longitudinal sickle cell biometric databases. No aggregated records of academic project best practices.
                    Every ChemXAI product is designed to solve a real problem AND collect the data that makes the next solution possible.
                  </p>
                </div>

                {/* Data sectors */}
                {filteredDataSectors.length > 0 ? (
                  <div className="flex flex-col gap-3 md:gap-5 mb-12 md:mb-16">
                    {filteredDataSectors.map((s, i) => (
                      <motion.div key={s.title}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                        className="flex gap-4 md:gap-5 p-5 md:p-7 rounded-2xl"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(34,211,238,0.06)' }}>
                          {s.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h4 className="font-bold text-white text-sm md:text-base" style={{ fontFamily: "'Sora', sans-serif" }}>{s.title}</h4>
                            <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(34,211,238,0.06)', color: 'rgba(34,211,238,0.5)' }}>via {s.product}</span>
                          </div>
                          <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.5)' }}>{s.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <NoResults query={searchQuery} />
                )}

                {/* The model — hide when searching */}
                {!q && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="p-6 md:p-8 rounded-2xl text-center"
                    style={{ background: 'rgba(34,211,238,0.03)', border: '1px solid rgba(34,211,238,0.1)' }}
                  >
                    <h3 className="text-base md:text-xl font-extrabold text-white mb-2 md:mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                      The Model: Deploy → Collect → Open
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed mx-auto" style={{ color: 'rgba(148,163,184,0.55)', maxWidth: 500 }}>
                      Every ChemXAI product solves an immediate problem for its users.
                      In the process, it generates structured, consented data that feeds research, trains better models,
                      and opens the door for other African developers to build on top.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-3 mt-5 md:mt-6">
                      {['Deploy real products', 'Collect consented data', 'Open to researchers'].map((step, i) => (
                        <motion.div key={step}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                          className="flex items-center justify-center gap-2 px-3.5 py-2 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-semibold"
                          style={{ background: 'rgba(34,211,238,0.08)', color: 'rgba(34,211,238,0.8)', fontFamily: "'Sora', sans-serif" }}
                        >
                          <span className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold flex-shrink-0"
                            style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee' }}>{i + 1}</span>
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
