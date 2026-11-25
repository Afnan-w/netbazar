export default function ProductsLoading() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading products</span>

      <div className="nova-panel mb-8 p-6 sm:p-8">
        <div className="skeleton h-3 w-24 rounded-badge" />
        <div className="skeleton mt-4 h-9 w-56 rounded-control" />
        <div className="skeleton mt-4 h-4 w-80 max-w-full rounded-badge" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
        <div className="hidden rounded-panel bg-primary-tint/20 p-3 lg:block">
          <div className="nova-card p-5">
            <div className="skeleton h-4 w-20 rounded-badge" />
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="mt-6">
                <div className="skeleton h-3 w-24 rounded-badge" />
                <div className="skeleton mt-2 h-10 w-full rounded-control" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="nova-card mb-5 flex items-center justify-between p-4">
            <div className="skeleton h-4 w-32 rounded-badge" />
            <div className="skeleton h-10 w-20 rounded-control" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="nova-card overflow-hidden">
                <div className="skeleton aspect-square w-full" />
                <div className="space-y-3 p-3.5">
                  <div className="skeleton h-3 w-2/3 rounded-badge" />
                  <div className="skeleton h-4 w-full rounded-badge" />
                  <div className="skeleton h-4 w-4/5 rounded-badge" />
                  <div className="skeleton h-9 w-full rounded-control" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
