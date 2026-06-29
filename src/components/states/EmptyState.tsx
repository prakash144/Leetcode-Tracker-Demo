interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => (
  <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-400">
    {message}
  </div>
);

export default EmptyState;
