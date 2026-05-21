import { motion } from 'framer-motion'

export default function Vision() {
  return (
    <section id="technology" className="relative py-24 px-6 bg-gradient-to-b from-[#081225] to-[#020617]">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
          <p className="text-sm text-cyan-400 uppercase tracking-[0.3em]">Our Vision</p>
          <h2 className="mt-4 text-4xl font-black text-white">Transforming AI into infrastructure.</h2>
          <p className="mt-6 text-slate-400 text-base leading-relaxed max-w-3xl mx-auto">
            We imagine a future where intelligent systems manage energy, health, and learning at scale — built for reliability, accessibility, and real outcomes.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
