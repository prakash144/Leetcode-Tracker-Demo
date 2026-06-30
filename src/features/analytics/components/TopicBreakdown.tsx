interface BreakdownItem {
  name: string;
  total: number;
  solved: number;
  attempted: number;
}

interface TopicBreakdownProps {
  items: BreakdownItem[];
}

const TopicBreakdown = ({ items }: TopicBreakdownProps) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
    <h2 className="text-base font-semibold text-white">Top Topic Progress</h2>
    <div className="mt-4 space-y-3">
      {items.length === 0 && (
        <div className="text-sm text-zinc-500">No topic data available.</div>
      )}
      {items.map((item) => {
        const solvedPercent = item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0;

        return (
          <div
            key={item.name}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"
          >
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium text-zinc-200">{item.name}</span>
              <span className="shrink-0 text-zinc-400">{solvedPercent}%</span>
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              {item.solved} solved, {item.attempted} attempted, {item.total} total
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default TopicBreakdown;
