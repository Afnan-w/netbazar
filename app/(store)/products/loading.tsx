export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" role="status" aria-live="polite">
      <span className="sr-only">Loading products</span>

      <div className="mb-8 border-b border-line pb-8">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton mt-4 h-9 w-56 rounded-lg" />
        <div className="skeleton mt-4 h-4 w-80 max-w-full rounded-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden rounded-2xl premium-card p-5 lg:block">
          <div className="skeleton h-4 w-20 rounded-full" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="mt-6">
              <div className="skeleton h-3 w-24 rounded-full" />
              <div className="skeleton mt-2 h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
            <div className="skeleton h-4 w-32 rounded-full" />
            <div className="skeleton h-10 w-20 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl premium-card">
                <div className="skeleton aspect-square w-full" />
                <div className="space-y-3 p-3.5">
                  <div className="skeleton h-3 w-2/3 rounded-full" />
                  <div className="skeleton h-4 w-full rounded-full" />
                  <div className="skeleton h-4 w-4/5 rounded-full" />
                  <div className="skeleton h-9 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
