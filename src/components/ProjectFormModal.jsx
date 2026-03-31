import { useEffect, useState } from 'react'
import { docId } from '../utils/mongo'

const emptyForm = {
  name: '',
  clientId: '',
  description: '',
}

export default function ProjectFormModal({ isOpen, clients, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!isOpen) return

    setForm((prev) => {
      if (!clients.length) {
        return { ...emptyForm, clientId: '' }
      }
      const ids = clients.map(docId)
      const current = prev.clientId
      const stillValid = current && ids.includes(current)
      return {
        ...prev,
        clientId: stillValid ? current : docId(clients[0]),
      }
    })
  }, [isOpen, clients])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Add Project</h2>
        </div>

        <form
          className="space-y-4 px-6 py-5"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(form)
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Project Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
            <select
              required
              value={form.clientId}
              onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              disabled={!clients.length}
            >
              {!clients.length ? (
                <option value="">No clients yet — add one on the Clients page</option>
              ) : (
                clients.map((c) => {
                  const id = docId(c)
                  return (
                    <option key={id} value={id}>
                      {c.name || 'Unnamed'}
                      {c.company ? ` — ${c.company}` : ''}
                    </option>
                  )
                })
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
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
              disabled={!clients.length || !form.clientId}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
