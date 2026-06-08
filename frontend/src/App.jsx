import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import PaymentPage from './pages/PaymentPage'
import ConfirmationPage from './pages/ConfirmationPage'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import Dashboard from './admin/Dashboard'
import BookingsManagement from './admin/BookingsManagement'
import CustomersManagement from './admin/CustomersManagement'
import ServicesManagement from './admin/ServicesManagement'
import Analytics from './admin/Analytics'
import ProtectedRoute from './admin/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/book" element={<BookingPage />} />
      <Route path="/payment/:ref" element={<PaymentPage />} />
      <Route path="/confirmation/:ref" element={<ConfirmationPage />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="customers" element={<CustomersManagement />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  )
}
