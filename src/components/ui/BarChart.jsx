// Simple accessible bar chart. data: [{ label, value, highlight }]
export default function BarChart({ data, height = 180, format = (v) => v }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-2 sm:gap-3" style={{ height }} role="list">
      {data.map((d, i) => (
        <div
          key={i}
          className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
          role="listitem"
          aria-label={`${d.label}: ${format(d.value)}`}
        >
          <span className={`text-[11px] font-semibold tabular-nums text-navy-600 ${d.value ? 'opacity-100' : 'opacity-0'}`}>{format(d.value)}</span>
          <div className="relative w-full max-w-[42px] flex-1">
            <div
              className={`absolute bottom-0 w-full rounded-t-lg transition-[height] duration-700 ease-out ${
                d.highlight ? 'bg-teal-500' : 'bg-navy-200 group-hover:bg-navy-300'
              }`}
              style={{ height: `${d.value ? Math.max(4, (d.value / max) * 100) : 2}%` }}
            />
          </div>
          <span className={`text-[11px] ${d.highlight ? 'font-bold text-navy-900' : 'text-navy-500'}`}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}
