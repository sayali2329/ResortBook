import { motion } from 'framer-motion'
import { Users, IndianRupee } from 'lucide-react'

const categoryLabels = { room: 'Room', table: 'Dining', service: 'Experience' }

export default function ServiceCard({ service, onSelect, selected }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      onClick={() => onSelect?.(service)}
      className={`glass-card overflow-hidden cursor-pointer transition-all duration-300 ${
        selected ? 'ring-2 ring-brand-500 shadow-premium' : 'hover:shadow-premium'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image_url}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-brand-700 dark:text-brand-300">
          {categoryLabels[service.category] || service.category}
        </span>
        {!service.availability && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
            Unavailable
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">{service.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{service.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold text-lg">
            <IndianRupee className="w-4 h-4" />
            {service.price.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-slate-400">/guest</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            Up to {service.capacity}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
