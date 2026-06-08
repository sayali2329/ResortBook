import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, MessageCircle, Calendar, Clock, Users, IndianRupee, Home } from 'lucide-react'
import Navbar from '../components/Navbar'
import { bookingsAPI } from '../services/api'

export default function ConfirmationPage() {
  const { ref } = useParams()
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('confirmed_booking')
    if (cached) {
      const data = JSON.parse(cached)
      if (data.booking_ref === ref) {
        setBooking(data)
        return
      }
    }
    bookingsAPI.getByRef(ref).then((res) => setBooking(res.data)).catch(() => {})
  }, [ref])

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading confirmation...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="section-title mb-2">Booking Confirmed!</h1>
          <p className="text-slate-500 mb-8">Your reservation has been successfully placed</p>

          <div className="glass-card p-8 text-left mb-8">
            <div className="text-center mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 mb-1">Booking Reference</p>
              <p className="text-2xl font-mono font-bold text-brand-600 dark:text-brand-400">{booking.booking_ref}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-sm text-slate-500">Time</p>
                  <p className="font-medium text-slate-900 dark:text-white">{booking.time_slot}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-sm text-slate-500">Guests</p>
                  <p className="font-medium text-slate-900 dark:text-white">{booking.guests}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IndianRupee className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-sm text-slate-500">Amount Paid</p>
                  <p className="font-medium text-slate-900 dark:text-white">₹{booking.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {booking.service && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 mb-1">Service</p>
                <p className="font-semibold text-slate-900 dark:text-white">{booking.service.name}</p>
              </div>
            )}
          </div>

          <div className="glass-card p-6 mb-8">
            <p className="text-sm text-slate-500 mb-4">Notifications sent (demo)</p>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-brand-500" /> Email confirmation
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp alert
              </div>
            </div>
          </div>

          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
