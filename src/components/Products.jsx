import { motion } from 'framer-motion'

const products = [
  { id: 'energy', name: 'Energy AI', desc: 'Predictive energy optimization for hospitals and industry.' },
  { id: 'health', name: 'Health AI', desc: 'Smart monitoring and alerts for patient safety.' },
  { id: 'academic', name: 'Academic AI', desc: 'Project intelligence for students and educators.' },
]

export default function Products() {
  return (
    <section id="products" className="relative py-24 px-6 bg-[#020617]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-sm text-cyan-400 uppercase tracking-[0.3em]">Product Suite</p>
          <h2 className="mt-4 text-4xl font-black text-white">AI systems built for impact.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-cyan-400/10 bg-[#081225] p-8"
            >
              <div className="text-cyan-400 text-sm font-semibold mb-3">{product.name}</div>
              <h3 className="text-2xl font-bold text-white">{product.name}</h3>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">{product.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
