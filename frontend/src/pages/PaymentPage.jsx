import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Shield, IndianRupee, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { bookingsAPI } from '../services/api'

const methods = [
  { id: 'razorpay', label: 'Razorpay', icon: CreditCard, desc: 'Cards, Net Banking, Wallets' },
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
]

export default function PaymentPage() {
  const { ref } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [method, setMethod] = useState('razorpay')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    const cached = sessionStorage.getItem('pending_booking')
    if (cached) {
      const data = JSON.parse(cached)
      if (data.booking_ref === ref) {
        setBooking(data)
        setLoading(false)
        return
      }
    }
    bookingsAPI.getByRef(ref)
      .then((res) => setBooking(res.data))
      .catch(() => {
        toast.error('Booking not found')
        navigate('/book')
      })
      .finally(() => setLoading(false))
  }, [ref, navigate])

  const handlePay = async () => {
    setPaying(true)
    try {
      const { data } = await bookingsAPI.pay(ref, { method, amount: booking.price })
      sessionStorage.removeItem('pending_booking')
      sessionStorage.setItem('confirmed_booking', JSON.stringify(data.booking))
      navigate(`/confirmation/${ref}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading payment...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title text-center mb-2">Complete Payment</h1>
          <p className="text-center text-slate-500 mb-10">Demo mode — no real charges will be made</p>

          <div className="glass-card p-6 mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Booking Summary</h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between"><span>Booking ID</span><span className="font-mono font-medium text-slate-900 dark:text-white">{booking.booking_ref}</span></div>
              <div className="flex justify-between"><span>Service</span><span className="font-medium text-slate-900 dark:text-white">{booking.service?.name}</span></div>
              <div className="flex justify-between"><span>Date</span><span>{new Date(booking.date).toLocaleDateString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Time</span><span>{booking.time_slot}</span></div>
              <div className="flex justify-between"><span>Guests</span><span>{booking.guests}</span></div>
              <div className="flex justify-between text-lg font-bold text-brand-600 dark:text-brand-400 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span>Total</span>
                <span className="flex items-center"><IndianRupee className="w-4 h-4" />{booking.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Payment Method</h3>
            <div className="space-y-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    method === m.id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                  }`}
                >
                  <m.icon className="w-6 h-6 text-brand-600" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900 dark:text-white">{m.label}</p>
                    <p className="text-sm text-slate-500">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 justify-center">
            <Shield className="w-4 h-4 text-green-500" />
            Secured with 256-bit SSL encryption (demo)
          </div>

          <button onClick={handlePay} disabled={paying} className="btn-primary w-full text-lg !py-4">
            {paying ? 'Processing Payment...' : `Pay ₹${booking.price.toLocaleString('en-IN')}`}
            {!paying && <ArrowRight className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
