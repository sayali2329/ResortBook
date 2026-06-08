import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Minus, Plus, Clock, IndianRupee } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import Calendar from '../components/Calendar'
import ServiceCard from '../components/ServiceCard'
import { CardSkeleton } from '../components/LoadingSkeleton'
import { servicesAPI, bookingsAPI } from '../services/api'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'room', label: 'Rooms' },
  { id: 'table', label: 'Dining' },
  { id: 'service', label: 'Experiences' },
]

export default function BookingPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState(null)
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [guests, setGuests] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })

  useEffect(() => {
    Promise.all([
      servicesAPI.getAll({ available: 'true' }),
      bookingsAPI.getTimeSlots(),
    ])
      .then(([svcRes, slotsRes]) => {
        setServices(svcRes.data)
        setTimeSlots(slotsRes.data)
      })
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = category === 'all' ? services : services.filter((s) => s.category === category)
  const price = selected ? selected.price * guests : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected || !date || !timeSlot) {
      toast.error('Please select service, date and time')
      return
    }
    if (!form.name || !form.email) {
      toast.error('Name and email are required')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await bookingsAPI.create({
        service_id: selected.id,
        date,
        time_slot: timeSlot,
        guests,
        ...form,
      })
      sessionStorage.setItem('pending_booking', JSON.stringify(data))
      navigate(`/payment/${data.booking_ref}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <WhatsAppButton />

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="section-title mb-3">Book Your Experience</h1>
          <p className="section-subtitle mx-auto">Select your preferred service, date, and time</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Category filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      category === c.id
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Services */}
              <div className="grid sm:grid-cols-2 gap-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                  : filtered.map((s) => (
                      <ServiceCard key={s.id} service={s} selected={selected?.id === s.id} onSelect={setSelected} />
                    ))}
              </div>

              {/* Calendar & Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Select Date
                  </h3>
                  <Calendar selected={date} onSelect={setDate} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Time Slot</h3>
                  <div className="glass-card p-4 grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          timeSlot === slot
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="glass-card p-6 space-y-5">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Booking Summary</h3>

                {selected ? (
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-slate-900 dark:text-white">{selected.name}</p>
                    {date && <p className="text-slate-500">📅 {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                    {timeSlot && <p className="text-slate-500">🕐 {timeSlot}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Select a service to continue</p>
                )}

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" /> Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{guests}</span>
                    <button type="button" onClick={() => setGuests(Math.min(selected?.capacity || 10, guests + 1))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex items-center justify-between text-lg font-bold text-brand-600 dark:text-brand-400">
                    <span>Total</span>
                    <span className="flex items-center"><IndianRupee className="w-5 h-5" />{price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <input className="input-field" placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <input className="input-field" type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <textarea className="input-field resize-none" rows={2} placeholder="Special requests" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>

                <button type="submit" disabled={submitting || !selected} className="btn-primary w-full disabled:opacity-50">
                  {submitting ? 'Processing...' : 'Continue to Payment'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
