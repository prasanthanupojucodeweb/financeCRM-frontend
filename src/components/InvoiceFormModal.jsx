import { useEffect, useMemo, useState } from 'react'
import { docId } from '../utils/mongo'

const emptyForm = {
  clientId: '',
  projectId: '',
  amount: '',
  currency: 'INR',
  status: 'Pending',
  dueDate: '',
}

function toDateInputValue(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

function projectClientId(p) {
  const c = p?.client
  if (!c) return ''
  if (typeof c === 'object') return docId(c)
  return String(c)
}

export default function InvoiceFormModal({
  isOpen,
  mode,
  clients,
  projects,
  initialValues,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm)

  const filteredProjects = useMemo(() => {
    if (!form.clientId) return []
    return projects.filter((p) => projectClientId(p) === form.clientId)
  }, [projects, form.clientId])

  useEffect(() => {
    if (!isOpen) return

    if (initialValues) {
      const clientId = docId(initialValues.client) || String(initialValues.client ?? '')
      const projectId = docId(initialValues.project) || String(initialValues.project ?? '')
      setForm({
        clientId,
        projectId,
        amount: String(initialValues.amount ?? ''),
        currency: initialValues.currency ?? 'INR',
        status: initialValues.status ?? 'Pending',
        dueDate: toDateInputValue(initialValues.dueDate),
      })
      return
    }

    const firstClientId = clients.length ? docId(clients[0]) : ''
    const forClient = firstClientId
      ? projects.filter((p) => projectClientId(p) === firstClientId)
      : []
    const firstPid = forClient.length ? docId(forClient[0]) : ''
    setForm({
      ...emptyForm,
      clientId: firstClientId,
      projectId: firstPid,
      currency: 'INR',
    })
  }, [isOpen, initialValues, clients, projects])

  useEffect(() => {
    if (!isOpen || initialValues) return
    if (!form.clientId || !filteredProjects.length) return
    const ok = filteredProjects.some((p) => docId(p) === form.projectId)
    if (!ok) {
      setForm((prev) => ({
        ...prev,
        projectId: docId(filteredProjects[0]),
      }))
    }
  }, [isOpen, initialValues, form.clientId, form.projectId, filteredProjects])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {mode === 'edit' ? 'Edit Invoice' : 'Add Invoice'}
          </h2>
        </div>

        <form
          className="space-y-4 px-6 py-5"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(form)
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
              <select
                required
                value={form.clientId}
                onChange={(e) => {
                  const nextClientId = e.target.value
                  const fp = projects.filter((p) => projectClientId(p) === nextClientId)
                  const firstPid = fp.length ? docId(fp[0]) : ''
                  setForm((prev) => ({
                    ...prev,
                    clientId: nextClientId,
                    projectId: firstPid,
                  }))
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                disabled={!clients.length}
              >
                {!clients.length ? (
                  <option value="">No clients — add clients first</option>
                ) : (
                  clients.map((c) => {
                    const id = docId(c)
                    return (
                      <option key={id} value={id}>
                        {c.name || 'Unnamed'}
                      </option>
                    )
                  })
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Project</label>
              <select
                required
                value={form.projectId}
                onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                disabled={!filteredProjects.length}
              >
                {!filteredProjects.length ? (
                  <option value="">No project for this client</option>
                ) : (
                  filteredProjects.map((p) => {
                    const id = docId(p)
                    return (
                      <option key={id} value={id}>
                        {p.name || 'Unnamed'}
                      </option>
                    )
                  })
                )}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Currency</label>
              <input
                type="text"
                required
                value={form.currency}
                onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Due Date</label>
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!clients.length || !filteredProjects.length}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {mode === 'edit' ? 'Update Invoice' : 'Add Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
