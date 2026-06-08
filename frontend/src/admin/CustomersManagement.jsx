import { useEffect, useState } from 'react'
import { Mail, Phone, CalendarCheck, IndianRupee } from 'lucide-react'
import { adminAPI } from '../services/api'
import { TableSkeleton } from '../components/LoadingSkeleton'

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    adminAPI.customers()
      .then((res) => setCustomers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Customers</h1>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="space-y-4">
          {customers.map((c) => (
            <div key={c.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                className="w-full p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{c.name}</p>
                  <div className="flex flex-wrap gap-4 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{c.email}</span>
                    {c.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{c.phone}</span>}
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-slate-900 dark:text-white">{c.total_bookings}</p>
                    <p className="text-slate-400 flex items-center gap-1"><CalendarCheck className="w-3 h-3" />Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-brand-600">₹{c.total_spent.toLocaleString('en-IN')}</p>
                    <p className="text-slate-400 flex items-center gap-1"><IndianRupee className="w-3 h-3" />Spent</p>
                  </div>
                </div>
              </button>

              {expanded === c.id && c.bookings?.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-sm font-medium text-slate-500 mb-3">Recent Bookings</p>
                  <div className="space-y-2">
                    {c.bookings.map((b) => (
                      <div key={b.id} className="flex justify-between text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div>
                          <span className="font-mono text-xs text-brand-600">{b.booking_ref}</span>
                          <span className="mx-2 text-slate-300">·</span>
                          <span>{b.service?.name}</span>
                        </div>
                        <div className="text-slate-500">
                          {new Date(b.date).toLocaleDateString('en-IN')} · ₹{b.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {customers.length === 0 && (
            <p className="text-center text-slate-400 py-12">No customers yet</p>
          )}
        </div>
      )}
    </div>
  )
}
