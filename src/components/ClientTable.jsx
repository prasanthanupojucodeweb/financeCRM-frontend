export default function ClientTable({ clients, onEdit, onDelete }) {
  if (!clients.length) {
    return (
      <div className="px-6 py-12 text-center text-sm text-slate-500">
        No clients yet. Add your first client to get started.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Phone</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Notes</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {clients.map((client) => (
            <tr key={client._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-slate-900">{client.name}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{client.company || '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{client.email || '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{client.phone || '—'}</td>
              <td className="max-w-xs truncate px-4 py-3 text-sm text-slate-600">
                {client.notes || '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(client)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(client)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
