import { useCallback, useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { apiFetchSafe } from '../utils/api'

function formatMoney(amount, currency = 'INR') {
  const n = Number(amount)
  if (Number.isNaN(n)) return '—'
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.length === 3 ? currency : 'INR',
      maximumFractionDigits: 2,
    }).format(n)
  } catch {
    return `${currency} ${n.toFixed(2)}`
  }
}

function MetricCard({ title, value, subtitle, accent }) {
  const accentClass =
    accent === 'emerald'
      ? 'border-emerald-200 bg-emerald-50/80'
      : accent === 'rose'
        ? 'border-rose-200 bg-rose-50/80'
        : accent === 'indigo'
          ? 'border-indigo-200 bg-indigo-50/80'
          : accent === 'amber'
            ? 'border-amber-200 bg-amber-50/80'
            : 'border-slate-200 bg-slate-50/80'

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${accentClass}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-600">{subtitle}</p> : null}
    </div>
  )
}

export default function Dashboard() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [byProject, setByProject] = useState([])

  const loadDashboard = useCallback(async () => {
    setLoadError('')
    setLoading(true)
    const res = await apiFetchSafe('/api/dashboard')
    setLoading(false)
    if (!res.ok) {
      setSummary(null)
      setByProject([])
      setLoadError(res.error || 'Could not load dashboard')
      return
    }
    const data = res.data || {}
    setSummary(data.summary || null)
    setByProject(Array.isArray(data.byProject) ? data.byProject : [])
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const currency = summary?.currency || 'INR'
  const hasProjectRows = byProject.length > 0

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Dashboard" onOpenSidebar={() => setIsMobileOpen(true)} />

      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="lg:pl-64">
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <section className="mb-6">
            <h1 className="text-lg font-semibold text-slate-900">Financial overview</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Figures are computed from your invoices and expenses. Revenue uses invoices marked{' '}
              <span className="font-medium text-slate-700">Paid</span>. Pending payments include{' '}
              <span className="font-medium text-slate-700">Pending</span> and{' '}
              <span className="font-medium text-slate-700">Overdue</span> invoices.
            </p>
          </section>

          {loadError ? (
            <p className="mb-4 text-sm font-medium text-rose-600">{loadError}</p>
          ) : null}

          {loading ? (
            <p className="text-sm text-slate-500">Loading metrics…</p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  title="Total revenue"
                  value={formatMoney(summary?.totalRevenue ?? 0, currency)}
                  subtitle="Sum of paid invoices"
                  accent="emerald"
                />
                <MetricCard
                  title="Total expenses"
                  value={formatMoney(summary?.totalExpenses ?? 0, currency)}
                  subtitle="All recorded expenses"
                  accent="rose"
                />
                <MetricCard
                  title="Net profit"
                  value={formatMoney(summary?.netProfit ?? 0, currency)}
                  subtitle="Revenue − expenses"
                  accent="indigo"
                />
                <MetricCard
                  title="Pending payments"
                  value={formatMoney(summary?.pendingPayments ?? 0, currency)}
                  subtitle="Unpaid invoice amounts"
                  accent="amber"
                />
              </div>

              {summary && summary.unlinkedExpenseTotal > 0 ? (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
                  <span className="font-medium">Expenses not linked to a project: </span>
                  {formatMoney(summary.unlinkedExpenseTotal, currency)} — included in total expenses above.
                </div>
              ) : null}

              <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900">By project &amp; client</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Revenue and pending amounts come from invoices tied to each project. Expenses use the
                    project selected on each expense (if any).
                  </p>
                </div>

                <div className="overflow-x-auto">
                  {!hasProjectRows ? (
                    <div className="px-6 py-12 text-center text-sm text-slate-500">
                      No projects yet. Create a client and project, then add invoices and expenses to see
                      per-project breakdown.
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                            Project
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                            Client
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                            Revenue
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                            Expenses
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                            Net
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                            Pending
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {byProject.map((row) => (
                          <tr key={row.projectId} className="transition-colors hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">
                              {row.projectName}
                              {row.orphan ? (
                                <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-600">
                                  legacy
                                </span>
                              ) : null}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              <span>{row.clientName}</span>
                              {row.clientCompany ? (
                                <span className="text-slate-500"> · {row.clientCompany}</span>
                              ) : null}
                            </td>
                            <td className="px-4 py-3 text-right text-sm tabular-nums text-emerald-800">
                              {formatMoney(row.revenue, currency)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm tabular-nums text-rose-800">
                              {formatMoney(row.expenses, currency)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium tabular-nums text-slate-900">
                              {formatMoney(row.net, currency)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm tabular-nums text-amber-900">
                              {formatMoney(row.pending, currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>

    </div>
  )
}
