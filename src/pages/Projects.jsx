import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ProjectFormModal from '../components/ProjectFormModal'
import { apiFetch, apiFetchSafe } from '../utils/api'

export default function Projects() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [projectModalKey, setProjectModalKey] = useState(0)
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [loadError, setLoadError] = useState('')

  const loadAll = useCallback(async () => {
    setLoadError('')
    const [pRes, cRes] = await Promise.all([
      apiFetchSafe('/api/projects'),
      apiFetchSafe('/api/clients'),
    ])

    if (pRes.ok) {
      setProjects(Array.isArray(pRes.data) ? pRes.data : [])
    } else {
      setProjects([])
    }

    if (cRes.ok) {
      setClients(Array.isArray(cRes.data) ? cRes.data : [])
    } else {
      setClients([])
    }

    const errors = [pRes, cRes].filter((r) => !r.ok).map((r) => r.error)
    if (errors.length) {
      setLoadError(errors.join(' · '))
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  /** Fresh clients from DB right before opening the modal (avoids stale empty list) */
  const openAddProjectModal = async () => {
    setLoadError('')
    const cRes = await apiFetchSafe('/api/clients')
    if (!cRes.ok) {
      alert(cRes.error || 'Could not load clients from the server.')
      return
    }
    setClients(Array.isArray(cRes.data) ? cRes.data : [])
    setProjectModalKey((k) => k + 1)
    setIsFormOpen(true)
  }

  const meta = useMemo(() => ({ totalProjects: projects.length }), [projects.length])

  const handleAddProject = async (values) => {
    try {
      await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          clientId: values.clientId,
          name: values.name,
          description: values.description ?? '',
        }),
      })
      setIsFormOpen(false)
      await loadAll()
    } catch (e) {
      alert(e.message || 'Failed to add project')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Projects" onOpenSidebar={() => setIsMobileOpen(true)} />
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="lg:pl-64">
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Projects</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Client list is loaded from your database when you add a project.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  Total Projects: {meta.totalProjects}
                </span>
                <button
                  type="button"
                  onClick={() => void openAddProjectModal()}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add Project
                </button>
              </div>
            </div>
          </section>

          {loadError ? (
            <p className="mb-4 text-sm font-medium text-rose-600">{loadError}</p>
          ) : null}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              {!projects.length ? (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  No projects yet. Add a client, then create a project.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Project Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Client Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Description
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {projects.map((project) => (
                      <tr key={project._id} className="transition-colors hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {project.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {project.client?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {project.description || '—'}
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

      <ProjectFormModal
        key={projectModalKey}
        isOpen={isFormOpen}
        clients={clients}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddProject}
      />
    </div>
  )
}
