import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import InvoiceFormModal from '../components/InvoiceFormModal'
import StatusBadge from '../components/StatusBadge'
import { apiFetch, apiFetchSafe } from '../utils/api'

function formatDueDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toISOString().slice(0, 10)
}

export default function Invoices() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [loadError, setLoadError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [invoiceModalKey, setInvoiceModalKey] = useState(0)
  const [formMode, setFormMode] = useState('add')
  const [editingInvoice, setEditingInvoice] = useState(null)

  const loadAll = useCallback(async () => {
    setLoadError('')
    const [invRes, cRes, pRes] = await Promise.all([
      apiFetchSafe('/api/invoices'),
      apiFetchSafe('/api/clients'),
      apiFetchSafe('/api/projects'),
    ])

    if (invRes.ok) setInvoices(Array.isArray(invRes.data) ? invRes.data : [])
    else setInvoices([])

    if (cRes.ok) setClients(Array.isArray(cRes.data) ? cRes.data : [])
    else setClients([])

    if (pRes.ok) setProjects(Array.isArray(pRes.data) ? pRes.data : [])
    else setProjects([])

    const errors = [invRes, cRes, pRes].filter((r) => !r.ok).map((r) => r.error)
    if (errors.length) setLoadError(errors.join(' · '))
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const summary = useMemo(() => ({ totalInvoices: invoices.length }), [invoices.length])

  const refreshClientsAndProjects = async () => {
    const [cRes, pRes] = await Promise.all([
      apiFetchSafe('/api/clients'),
      apiFetchSafe('/api/projects'),
    ])
    if (!cRes.ok) {
      alert(cRes.error || 'Could not load clients')
      return false
    }
    if (!pRes.ok) {
      alert(pRes.error || 'Could not load projects')
      return false
    }
    setClients(Array.isArray(cRes.data) ? cRes.data : [])
    setProjects(Array.isArray(pRes.data) ? pRes.data : [])
    return true
  }

  const openAddModal = async () => {
    const ok = await refreshClientsAndProjects()
    if (!ok) return
    setFormMode('add')
    setEditingInvoice(null)
    setInvoiceModalKey((k) => k + 1)
    setIsFormOpen(true)
  }

  const openEditModal = async (invoice) => {
    const ok = await refreshClientsAndProjects()
    if (!ok) return
    setFormMode('edit')
    setEditingInvoice(invoice)
    setInvoiceModalKey((k) => k + 1)
    setIsFormOpen(true)
  }

  const handleSubmitInvoice = async (form) => {
    const payload = {
      clientId: form.clientId,
      projectId: form.projectId,
      amount: Number(form.amount),
      currency: form.currency,
      status: form.status,
      dueDate: form.dueDate,
    }

    try {
      if (formMode === 'edit' && editingInvoice) {
        await apiFetch(`/api/invoices/${editingInvoice._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiFetch('/api/invoices', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      setIsFormOpen(false)
      setEditingInvoice(null)
      await loadAll()
    } catch (e) {
      alert(e.message || 'Save failed')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Invoices" onOpenSidebar={() => setIsMobileOpen(true)} />
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="lg:pl-64">
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Invoices</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Clients and projects are loaded from the database when you add or edit an invoice.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  Total Invoices: {summary.totalInvoices}
                </span>
                <button
                  type="button"
                  onClick={() => void openAddModal()}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add Invoice
                </button>
              </div>
            </div>
          </section>

          {loadError ? (
            <p className="mb-4 text-sm font-medium text-rose-600">{loadError}</p>
          ) : null}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              {!invoices.length ? (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  No invoices yet. Add clients and projects first, then create an invoice.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Client Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Project Name
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {invoices.map((invoice) => (
                      <tr key={invoice._id} className="transition-colors hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {invoice.client?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {invoice.project?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          {invoice.currency} {Number(invoice.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={invoice.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {formatDueDate(invoice.dueDate)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => void openEditModal(invoice)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
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

      <InvoiceFormModal
        key={invoiceModalKey}
        isOpen={isFormOpen}
        mode={formMode}
        clients={clients}
        projects={projects}
        initialValues={editingInvoice}
        onClose={() => {
          setIsFormOpen(false)
          setEditingInvoice(null)
        }}
        onSubmit={handleSubmitInvoice}
      />
    </div>
  )
}
