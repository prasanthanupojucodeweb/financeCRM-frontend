import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ClientTable from '../components/ClientTable'
import ClientFormModal from '../components/ClientFormModal'
import { apiFetch } from '../utils/api'

function DeleteConfirmDialog({ client, onConfirm, onCancel }) {
  if (!client) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">Delete Client</h2>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to delete <span className="font-semibold">{client.name}</span>?
          This action cannot be undone.
        </p>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Clients() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [clients, setClients] = useState([])
  const [loadError, setLoadError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [editingClient, setEditingClient] = useState(null)
  const [deleteClient, setDeleteClient] = useState(null)

  const loadClients = useCallback(async () => {
    setLoadError('')
    try {
      const data = await apiFetch('/api/clients')
      setClients(Array.isArray(data) ? data : [])
    } catch (e) {
      setLoadError(e.message || 'Failed to load clients')
      setClients([])
    }
  }, [])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const totals = useMemo(() => ({ count: clients.length }), [clients.length])

  const openAddModal = () => {
    setFormMode('add')
    setEditingClient(null)
    setIsFormOpen(true)
  }

  const openEditModal = (client) => {
    setFormMode('edit')
    setEditingClient(client)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingClient(null)
  }

  const handleSubmitClient = async (values) => {
    try {
      if (formMode === 'edit' && editingClient) {
        await apiFetch(`/api/clients/${editingClient._id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        })
      } else {
        await apiFetch('/api/clients', {
          method: 'POST',
          body: JSON.stringify(values),
        })
      }
      closeForm()
      await loadClients()
    } catch (e) {
      alert(e.message || 'Save failed')
    }
  }

  const handleDeleteClient = async () => {
    if (!deleteClient) return
    try {
      await apiFetch(`/api/clients/${deleteClient._id}`, { method: 'DELETE' })
      setDeleteClient(null)
      await loadClients()
    } catch (e) {
      alert(e.message || 'Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Clients" onOpenSidebar={() => setIsMobileOpen(true)} />
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="lg:pl-64">
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Clients</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Your clients are saved to your account only.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  Total Clients: {totals.count}
                </span>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add Client
                </button>
              </div>
            </div>
          </section>

          {loadError ? (
            <p className="mb-4 text-sm font-medium text-rose-600">{loadError}</p>
          ) : null}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ClientTable clients={clients} onEdit={openEditModal} onDelete={setDeleteClient} />
          </section>
        </main>
      </div>

      <ClientFormModal
        isOpen={isFormOpen}
        mode={formMode}
        initialValues={editingClient}
        onClose={closeForm}
        onSubmit={handleSubmitClient}
      />

      <DeleteConfirmDialog
        client={deleteClient}
        onConfirm={handleDeleteClient}
        onCancel={() => setDeleteClient(null)}
      />
    </div>
  )
}
