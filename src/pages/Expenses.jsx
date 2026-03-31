import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ExpenseFormModal from '../components/ExpenseFormModal'
import { apiFetch, apiFetchSafe } from '../utils/api'

const expenseCategories = [
  'Software',
  'Travel',
  'Office Supplies',
  'Marketing',
  'Utilities',
]

function formatExpenseDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toISOString().slice(0, 10)
}

export default function Expenses() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [projects, setProjects] = useState([])
  const [loadError, setLoadError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [expenseModalKey, setExpenseModalKey] = useState(0)

  const loadAll = useCallback(async () => {
    setLoadError('')
    const [exRes, pRes] = await Promise.all([
      apiFetchSafe('/api/expenses'),
      apiFetchSafe('/api/projects'),
    ])

    if (exRes.ok) setExpenses(Array.isArray(exRes.data) ? exRes.data : [])
    else setExpenses([])

    if (pRes.ok) setProjects(Array.isArray(pRes.data) ? pRes.data : [])
    else setProjects([])

    const errors = [exRes, pRes].filter((r) => !r.ok).map((r) => r.error)
    if (errors.length) setLoadError(errors.join(' · '))
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const summary = useMemo(() => ({ totalCount: expenses.length }), [expenses.length])

  const openAddExpenseModal = async () => {
    setLoadError('')
    const pRes = await apiFetchSafe('/api/projects')
    if (!pRes.ok) {
      alert(pRes.error || 'Could not load projects from the server.')
      return
    }
    setProjects(Array.isArray(pRes.data) ? pRes.data : [])
    setExpenseModalKey((k) => k + 1)
    setIsFormOpen(true)
  }

  const handleAddExpense = async (values) => {
    try {
      await apiFetch('/api/expenses', {
        method: 'POST',
        body: JSON.stringify({
          title: values.title,
          category: values.category,
          amount: Number(values.amount),
          date: values.date,
          projectId: values.projectId || undefined,
        }),
      })
      setIsFormOpen(false)
      await loadAll()
    } catch (e) {
      alert(e.message || 'Failed to add expense')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Expenses" onOpenSidebar={() => setIsMobileOpen(true)} />
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="lg:pl-64">
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Expenses</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Project list is refreshed from the database when you add an expense.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  Total Entries: {summary.totalCount}
                </span>
                <button
                  type="button"
                  onClick={() => void openAddExpenseModal()}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </section>

          {loadError ? (
            <p className="mb-4 text-sm font-medium text-rose-600">{loadError}</p>
          ) : null}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              {!expenses.length ? (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  No expenses yet. Add your first expense when you&apos;re ready.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Category
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Project
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {expenses.map((expense) => (
                      <tr key={expense._id} className="transition-colors hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {expense.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{expense.category}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          {Number(expense.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {formatExpenseDate(expense.date)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {expense.project?.name ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>

      <ExpenseFormModal
        key={expenseModalKey}
        isOpen={isFormOpen}
        categories={expenseCategories}
        projects={projects}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  )
}
