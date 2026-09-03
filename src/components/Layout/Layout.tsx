import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Nav } from './Nav'

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Nav />
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
