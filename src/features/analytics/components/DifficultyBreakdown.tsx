interface BreakdownItem {
  name: string;
  total: number;
  solved: number;
  attempted: number;
}

interface DifficultyBreakdownProps {
  items: BreakdownItem[];
}

const DifficultyBreakdown = ({ items }: DifficultyBreakdownProps) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
    <h2 className="text-base font-semibold text-white">Difficulty Breakdown</h2>
    <div className="mt-4 space-y-4">
      {items.length === 0 && (
        <div className="text-sm text-zinc-500">No difficulty data available.</div>
      )}
      {items.map((item) => {
        const solvedPercent = item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0;

        return (
          <div key={item.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-200">{item.name}</span>
              <span className="text-zinc-400">
                {item.solved}/{item.total} solved
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full bg-green-500" style={{ width: `${solvedPercent}%` }} />
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              {item.attempted} attempted, {solvedPercent}% complete
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default DifficultyBreakdown;
