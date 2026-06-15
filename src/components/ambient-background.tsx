export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-background">
      {/* Top Left Blob */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/[0.08] blur-[180px] rounded-full" />
      {/* Bottom Right Blob */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/[0.05] blur-[180px] rounded-full" />
      {/* SVG Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.025] mix-blend-soft-light pointer-events-none -z-10">
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
