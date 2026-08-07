export default function ProgressPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8 h-full flex flex-col justify-center items-center text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface">Detailed Progress</h1>
        <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">
          Advanced analytics, weekly learning reports, and skill graphs are currently under development. Check back later!
        </p>
      </div>
      <div className="px-6 py-2 rounded-full bg-surface-container border border-outline-variant text-sm font-medium text-on-surface-muted">
        Coming Soon
      </div>
    </div>
  );
}
