export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-background">
      {/* SVG Noise Overlay — HorizonGlow owns all glow/blobs now */}
      <div className="fixed inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none -z-10">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  );
}
