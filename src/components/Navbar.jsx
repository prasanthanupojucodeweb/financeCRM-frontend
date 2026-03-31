import { CircleUserRound, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clearSession, getStoredUser } from '../utils/auth'

export default function Navbar({ title, onOpenSidebar }) {
  const navigate = useNavigate()
  const user = getStoredUser()
  const displayName = user?.name?.trim() || 'User'

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </button>

          <div
            role="heading"
            aria-level={1}
            className="text-base sm:text-lg font-semibold tracking-tight text-slate-900"
          >
            {title}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 flex items-center justify-center text-white">
              <CircleUserRound className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium text-slate-900">{displayName}</div>
              <div className="text-xs text-slate-500">Signed in</div>
            </div>
          </div>

          <div className="sm:hidden">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 flex items-center justify-center text-white">
              <CircleUserRound className="h-5 w-5" />
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 text-slate-700" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
