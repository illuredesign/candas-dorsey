export default function ScrollHint() {
  return (
    <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-center sm:bottom-5">
      <div className="mx-auto mb-1.5 h-6 w-px animate-pulse bg-gradient-to-b from-transparent to-canvas-cream/30 sm:h-9" />
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-canvas-cream/25">
        Scroll
      </span>
    </div>
  )
}
