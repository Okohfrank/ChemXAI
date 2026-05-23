export default function NeuralHead() {
  return (
    <img
      src="/headimage.png"
      alt=""
      draggable={false}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        userSelect: 'none',
        filter: 'contrast(1.2) brightness(1.15)',
        imageRendering: 'auto',
      }}
    />
  )
}
