import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Users,
  Wallet,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, path: '/' },
  { key: 'clients', label: 'Clients', Icon: Users, path: '/clients' },
  { key: 'projects', label: 'Projects', Icon: Briefcase, path: '/projects' },
  { key: 'invoices', label: 'Invoices', Icon: FileText, path: '/invoices' },
  { key: 'expenses', label: 'Expenses', Icon: Wallet, path: '/expenses' },
]

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const location = useLocation()
  const navigate = useNavigate()

  const activeKeyByPath = {
    '/': 'dashboard',
    '/clients': 'clients',
    '/projects': 'projects',
    '/invoices': 'invoices',
    '/expenses': 'expenses',
  }

  const activeNav = activeKeyByPath[location.pathname] ?? 'dashboard'

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-slate-900/40 lg:hidden',
          isMobileOpen ? 'block' : 'hidden',
        ].join(' ')}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={[
          'fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-slate-200 bg-white transition-transform duration-200',
          'lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:z-20',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 flex items-center justify-center text-white shadow-sm ring-1 ring-indigo-500/20">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2v8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M7.5 4.6a9 9 0 1 0 9 0"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">FinTrackr</div>
              <div className="text-xs text-slate-500">Finance CRM</div>
            </div>
          </div>
        </div>

        <nav className="px-3 py-4">
          {navItems.map(({ key, label, Icon, path }) => {
            const isActive = activeNav === key
            const isDisabled = !path
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (path) {
                    navigate(path)
                  }
                  setIsMobileOpen(false)
                }}
                disabled={isDisabled}
                className={[
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium',
                  'transition-colors disabled:cursor-not-allowed disabled:opacity-55',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-100',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={[
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-700'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
                  ].join(' ')}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>{label}</span>
                {isDisabled ? (
                  <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    Soon
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

