/**
 * PlaceholderPage — used by every route in Phase 0.
 * Replaced with real content in the corresponding phase.
 */
export default function PlaceholderPage({ title, route }) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{ backgroundColor: 'var(--signal-soft)' }}
        >
          <span className="font-mono text-lg font-bold" style={{ color: 'var(--navy-900)' }}>
            GT
          </span>
        </div>
        <h1
          className="font-display text-xl font-bold mb-2"
          style={{ color: 'var(--navy-900)', fontFamily: 'Archivo, sans-serif' }}
        >
          {title}
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)', fontFamily: 'Public Sans, sans-serif' }}>
          Phase 0 placeholder — route:{' '}
          <code className="font-mono text-xs" style={{ color: 'var(--signal)' }}>
            {route}
          </code>
        </p>
      </div>
    </div>
  );
}
