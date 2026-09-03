import { Link, useLocation } from 'react-router-dom'

export function Nav() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/dashboard', label: '대시보드' },
    { path: '/my-reservations', label: '내 예약' }
  ]

  return (
    <nav className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-6 py-3 font-medium transition ${
              location.pathname === item.path
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
