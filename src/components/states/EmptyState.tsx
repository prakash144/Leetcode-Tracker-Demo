interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => (
  <div
    role="status"
    className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-8 text-center text-sm text-muted-foreground"
  >
    {message}
  </div>
);

export default EmptyState;
