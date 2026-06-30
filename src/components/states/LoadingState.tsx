interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div
    role="status"
    aria-live="polite"
    className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-6 text-center text-sm text-zinc-400"
  >
    <div className="mx-auto mb-3 h-2 max-w-xs overflow-hidden rounded-full bg-zinc-800">
      <div className="h-full w-1/3 animate-pulse rounded-full bg-green-500" />
    </div>
    {message}
  </div>
);

export default LoadingState;
