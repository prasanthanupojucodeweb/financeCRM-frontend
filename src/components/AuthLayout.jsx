import { BarChart3, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  return (
    <div className="auth-page relative min-h-screen overflow-hidden bg-white">
      <div className="auth-blob auth-blob-1" aria-hidden="true" />
      <div className="auth-blob auth-blob-2" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-2 xl:gap-8">
          <section className="auth-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 font-semibold text-white shadow-sm">
              F
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">{subtitle}</p>

            <div className="mt-6">{children}</div>

            <p className="mt-6 text-center text-sm text-slate-500">
              {footerText}{' '}
              <Link
                to={footerLinkTo}
                className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
              >
                {footerLinkText}
              </Link>
            </p>
          </section>

          <aside className="auth-visual relative hidden overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 p-8 shadow-sm lg:block">
            <div className="absolute inset-0 auth-grid-pattern opacity-60" aria-hidden="true" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-3 py-1 text-xs font-medium text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                FinTrackr Secure Workspace
              </div>

              <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-tight text-slate-900">
                Manage clients, invoices, and cashflow in one beautiful dashboard.
              </h2>
              <p className="mt-3 max-w-md text-sm text-slate-600">
                A modern finance CRM experience designed for fast teams and better
                visibility.
              </p>

              <div className="mt-8 space-y-4">
                <div className="floating-panel rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Monthly Revenue</p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">₹1,20,000</p>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <BarChart3 className="h-5 w-5" />
                    </span>
                  </div>
                </div>

                <div className="floating-panel floating-panel-delay rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Security Status</p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">Protected</p>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

