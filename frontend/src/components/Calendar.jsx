import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Calendar({ selected, onSelect, minDate }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const min = minDate ? new Date(minDate) : today

  const [view, setView] = useState(() => {
    const d = selected ? new Date(selected) : today
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const firstDay = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()

  const prev = () => {
    setView((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })
  }
  const next = () => {
    setView((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prev} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {MONTHS[view.month]} {view.year}
        </h3>
        <button onClick={next} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const date = new Date(view.year, view.month, day)
          const dateStr = toDateStr(date)
          const isPast = date < min
          const isSelected = selected === dateStr
          const isToday = toDateStr(today) === dateStr

          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.9 }}
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={`
                aspect-square rounded-xl text-sm font-medium transition-all
                ${isPast ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'hover:bg-brand-50 dark:hover:bg-brand-900/30 cursor-pointer'}
                ${isSelected ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-brand-400 text-brand-600 dark:text-brand-400' : ''}
                ${!isSelected && !isPast ? 'text-slate-700 dark:text-slate-300' : ''}
              `}
            >
              {day}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
