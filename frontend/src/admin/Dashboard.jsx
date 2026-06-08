import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, IndianRupee, Clock, CheckCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { adminAPI } from '../services/api'
import { StatSkeleton } from '../components/LoadingSkeleton'

const statCards = [
  { key: 'total_bookings', label: 'Total Bookings', icon: CalendarCheck, iconBg: 'bg-brand-100 dark:bg-brand-900/30', iconColor: 'text-brand-600' },
  { key: 'today_bookings', label: "Today's Bookings", icon: Clock, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
  { key: 'revenue', label: 'Revenue', icon: IndianRupee, iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600', format: (v) => `₹${v.toLocaleString('en-IN')}` },
  { key: 'pending_bookings', label: 'Pending', icon: CheckCircle, iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminAPI.dashboard(), adminAPI.analytics()])
      .then(([statsRes, analyticsRes]) => {
        setStats(statsRes.data)
        setAnalytics(analyticsRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map((card, i) => (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {card.format ? card.format(stats[card.key]) : stats[card.key]}
                </p>
              </motion.div>
            ))}
      </div>

      {analytics && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Bookings (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analytics.daily}>
                <defs>
                  <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#0ea5e9" fill="url(#bookGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analytics.daily}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
