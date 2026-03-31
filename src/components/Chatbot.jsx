import { useEffect, useMemo, useRef, useState } from 'react'

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getBotResponse(userText) {
  const msg = String(userText || '').toLowerCase().trim()

  if (msg === 'hello' || msg === 'hi' || msg === 'hey') {
    return 'Hello! 👋 Welcome to FinTrackr. I\'m your assistant. I can guide you on how to use this platform to manage clients, invoices, expenses, and track your profit. Ask me anything!'
  }

  if (msg.includes('how this app works') || msg.includes('how does this work') || msg.includes('what is this app')) {
    return 'FinTrackr is a Finance CRM designed to help you manage your business finances in one place. You can add clients, create projects, generate invoices, track expenses, and monitor your overall profit. Everything is organized to give you a clear view of your income and spending.'
  }

  if (msg.includes('explain this application') || msg.includes('about this app')) {
    return 'This application helps businesses track their financial activities. You can manage clients, assign projects, generate invoices for billing, record expenses, and view reports on your revenue and profit. It simplifies financial management without needing complex accounting tools.'
  }

  if (msg.includes('track income') || msg.includes('how to track income') || msg.includes('how to track revenue')) {
    return 'To track your income in FinTrackr:\n\n1. Add a client in the Clients section.\n2. Create a project linked to that client.\n3. Generate an invoice for the project with the amount.\n4. When payment is received, mark the invoice as \'Paid\'.\n5. Your dashboard will automatically update your total revenue and profit.'
  }

  // Keep existing keyword-based guidance.
  if (msg.includes('client')) {
    return 'Go to Clients page and click Add Client to create a new client.'
  }
  if (msg.includes('project')) {
    return 'Go to Projects page and create a project linked to a client.'
  }
  if (msg.includes('invoice')) {
    return 'Go to Invoices page and click Add Invoice to generate billing.'
  }
  if (msg.includes('expense')) {
    return 'Go to Expenses page and add your expenses.'
  }
  if (msg.includes('dashboard')) {
    return 'Dashboard shows revenue, expenses, and profit.'
  }

  return "I'm here to help! You can ask me about how the app works, tracking income, or managing clients, projects, invoices, and expenses."
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(() => [
    {
      id: makeId(),
      role: 'bot',
      text: "I'm here to help! You can ask me about how the app works, tracking income, or managing clients, projects, invoices, and expenses.",
    },
  ])

  const chatEndRef = useRef(null)
  const messagesWrapRef = useRef(null)

  const canSend = useMemo(() => draft.trim().length > 0, [draft])

  useEffect(() => {
    if (!isOpen) return
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isOpen])

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 pointer-events-auto bg-slate-900/10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute bottom-6 right-6 w-full max-w-sm pointer-events-auto">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-white"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2c5.523 0 10 4.477 10 10 0 5.523-4.477 10-10 10S2 17.523 2 12C2 6.477 6.477 2 12 2Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M8 12.2c1.2-2.2 6.8-2.2 8 0"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.3 9.4h.01M14.7 9.4h.01"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">FinTrackr Assistant</p>
                    <p className="text-xs text-indigo-100">Your finance copilot</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-white/15 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/25 hover:bg-white/20"
                  aria-label="Close chat"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 6l12 12M18 6 6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div
                ref={messagesWrapRef}
                className="max-h-[60vh] overflow-y-auto bg-slate-50 px-4 py-4"
                role="log"
                aria-label="Chat messages"
              >
                <div className="space-y-4">
                  {messages.map((m) => {
                    const isUser = m.role === 'user'
                    return (
                      <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={[
                            'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ring-1',
                            isUser
                              ? 'bg-indigo-600 text-white ring-indigo-500/30'
                              : 'bg-white text-slate-900 ring-slate-200',
                          ].join(' ')}
                        >
                          {m.text}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <form
                className="flex gap-2 border-t border-slate-200 bg-white p-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!canSend) return

                  const text = draft.trim()
                  setDraft('')

                  setMessages((prev) => [...prev, { id: makeId(), role: 'user', text }])

                  // Simple "thinking" delay for realism.
                  window.setTimeout(() => {
                    setMessages((prev) => [...prev, { id: makeId(), role: 'bot', text: getBotResponse(text) }])
                  }, 520 + Math.floor(Math.random() * 180))
                }}
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsOpen(false)
                  }}
                  type="text"
                  placeholder="Ask about clients, projects, invoices..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-100 focus:border-indigo-500 focus:ring-2"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-500/30 hover:bg-indigo-700"
          aria-label="Open FinTrackr assistant"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2c5.523 0 10 4.477 10 10 0 5.523-4.477 10-10 10S2 17.523 2 12C2 6.477 6.477 2 12 2Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M8 12.2c1.2-2.2 6.8-2.2 8 0"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M9.3 9.4h.01M14.7 9.4h.01"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </>
  )
}

