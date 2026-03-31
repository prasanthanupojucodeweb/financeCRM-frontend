export default function StatCard({ title, value, Icon, iconBg, iconColor }) {
  return (
    <div
      className={[
        'group relative overflow-hidden rounded-2xl bg-white',
        'border border-slate-200',
        'shadow-sm transition-transform duration-200',
        'hover:-translate-y-0.5 hover:shadow-md',
      ].join(' ')}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-slate-500">{title}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {value}
            </div>
          </div>

          <div
            className={[
              'flex h-11 w-11 items-center justify-center rounded-xl',
              iconBg,
              iconColor,
            ].join(' ')}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div
        className={[
          'pointer-events-none absolute inset-x-0 bottom-0 h-1',
          'bg-gradient-to-r from-indigo-600/30 via-fuchsia-500/30 to-indigo-600/30',
          'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
        ].join(' ')}
      />
    </div>
  )
}

