export default function RootLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="h-4 w-16 animate-pulse rounded bg-zinc-800" />
        <div className="h-8 w-64 animate-pulse rounded bg-zinc-800" />
        <div className="h-4 w-96 animate-pulse rounded bg-zinc-800" />
      </div>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
          <div className="flex items-center gap-5">
            <div className="size-14 animate-pulse rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-zinc-800" />
              <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" />
          ))}
        </div>
      </div>
    </div>
  );
}
