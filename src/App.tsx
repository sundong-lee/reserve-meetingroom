import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { MyReservations } from './pages/MyReservations'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-reservations" element={<MyReservations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
