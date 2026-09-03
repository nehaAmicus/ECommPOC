import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../hooks/useAppSelector'
import { logout } from '../store/authSlice'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${
    isActive ? 'text-[var(--text-color)]' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
  }`

export function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const user = useAppSelector((state) => state.auth.user)
  const localCartItems = useAppSelector((state) => state.cart.items)
  const cartCount = localCartItems.reduce((sum, item) => sum + item.quantity, 0)

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--panel-bg)] transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <NavLink to="/products" className="text-xl font-semibold text-[var(--text-color)]">
          EcommPOC
        </NavLink>

        <nav className="flex items-center gap-4 text-sm text-[var(--muted-color)]">
          <NavLink to="/products" className={navLinkClass}>Products</NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            <span className="inline-flex items-center gap-2">
              Cart
              {cartCount > 0 && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-sky-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </span>
          </NavLink>
          <NavLink to="/compare" className={navLinkClass}>Compare</NavLink>

          <button
            type="button"
            onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle color theme"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--panel-alt)] px-3 py-1.5 font-medium text-[var(--text-color)] transition hover:border-sky-400 hover:text-sky-600"
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-[var(--text-color)]">
                {user?.username ?? 'User'}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-[var(--border-color)] bg-[var(--panel-alt)] px-3 py-1.5 font-medium text-[var(--text-color)] transition hover:border-sky-400 hover:text-sky-600"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
