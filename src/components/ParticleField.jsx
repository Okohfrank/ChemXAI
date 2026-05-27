import { useEffect, useRef } from 'react'

export default function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const isMobile = window.innerWidth < 768
    const COUNT = isMobile ? 18 : 50
    const CONNECT_DIST = isMobile ? 0 : 110   // skip lines on mobile entirely
    const FRAME_MS = 1000 / 30                 // cap at 30fps everywhere
    let lastTime = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.55 + 0.12,
    }))

    const draw = (ts) => {
      animId = requestAnimationFrame(draw)
      if (ts - lastTime < FRAME_MS) return
      lastTime = ts

      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34,211,238,${p.alpha})`
        ctx.fill()
      })

      // connection lines — desktop only
      if (CONNECT_DIST > 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < CONNECT_DIST) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = `rgba(34,211,238,${(0.08 * (1 - dist / CONNECT_DIST)).toFixed(3)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }
    }
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  )
}
