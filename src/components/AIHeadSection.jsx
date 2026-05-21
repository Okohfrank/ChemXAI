import { motion } from 'framer-motion'

export default function AIHeadSection() {
  return (
    <section id="about" className="relative py-24 px-6 bg-[#081225]">
      <div className="max-w-7xl mx-auto grid gap-14 lg:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-cyan-400/10 bg-[#081a2d] p-10"
        >
          <div className="mb-4 text-cyan-400 text-sm font-semibold">About ChemXAI</div>
          <h2 className="text-4xl font-black text-white">AI for systems, not just software.</h2>
          <p className="mt-6 text-slate-400 leading-relaxed">
            We build intelligent infrastructure and healthcare solutions that deliver actionable predictions, operational efficiency, and safer outcomes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid gap-6"
        >
          {[
            { title: 'Predictive Systems', text: 'AI that anticipates demand, failures, and energy load.' },
            { title: 'Next-gen Health', text: 'Data-driven monitoring for patient safety and hospital resilience.' },
            { title: 'Academic Intelligence', text: 'Smart workflows for research and engineering education.' },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-cyan-400/10 bg-[#05111f] p-6">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
