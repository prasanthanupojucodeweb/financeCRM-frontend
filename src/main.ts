import './app.css'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const el = document.getElementById('app')
if (!el) {
  throw new Error('Missing #app mount element in index.html')
}

createRoot(el).render(createElement(App))
