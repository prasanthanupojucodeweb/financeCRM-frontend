const toneByStatus = {
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Overdue: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function StatusBadge({ status }) {
  const tone = toneByStatus[status] ?? toneByStatus.Pending
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        tone,
      ].join(' ')}
    >
      {status}
    </span>
  )
}

