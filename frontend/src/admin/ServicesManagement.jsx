import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { servicesAPI } from '../services/api'
import { CardSkeleton } from '../components/LoadingSkeleton'

const emptyForm = { name: '', category: 'room', price: '', description: '', image_url: '', capacity: 2, availability: true }

export default function ServicesManagement() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = () => {
    servicesAPI.getAll()
      .then((res) => setServices(res.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setModal('create')
  }

  const openEdit = (s) => {
    setForm({ ...s, price: String(s.price), capacity: s.capacity })
    setModal(s.id)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price), capacity: parseInt(form.capacity) }
    try {
      if (modal === 'create') {
        await servicesAPI.create(payload)
        toast.success('Service created')
      } else {
        await servicesAPI.update(modal, payload)
        toast.success('Service updated')
      }
      setModal(null)
      load()
    } catch {
      toast.error('Save failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try {
      await servicesAPI.delete(id)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Services</h1>
        <button onClick={openCreate} className="btn-primary !py-2 !px-4 text-sm">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="glass-card overflow-hidden">
              {s.image_url && (
                <img src={s.image_url} alt={s.name} className="h-36 w-full object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{s.name}</h3>
                    <p className="text-xs text-slate-400 capitalize">{s.category} · ₹{s.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${s.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {s.availability ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{s.description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(s)} className="flex-1 btn-secondary !py-2 text-sm">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <form onSubmit={handleSave} className="glass-card p-6 w-full max-w-lg space-y-4 !bg-white dark:!bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{modal === 'create' ? 'Add Service' : 'Edit Service'}</h3>
              <button type="button" onClick={() => setModal(null)}><X className="w-5 h-5" /></button>
            </div>
            <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="room">Room</option>
              <option value="table">Table</option>
              <option value="service">Service</option>
            </select>
            <input className="input-field" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="input-field" type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            <input className="input-field" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <textarea className="input-field resize-none" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} />
              Available for booking
            </label>
            <button type="submit" className="btn-primary w-full">Save</button>
          </form>
        </div>
      )}
    </div>
  )
}
