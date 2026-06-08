import { Link } from 'react-router-dom'
import { Building2, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-white">ResortBook</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Your gateway to luxury stays, fine dining, and unforgettable experiences.
              Book rooms, tables, and premium services with confidence.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/book" className="hover:text-brand-400 transition-colors">Book Now</Link></li>
              <li><a href="#services" className="hover:text-brand-400 transition-colors">Services</a></li>
              <li><a href="#gallery" className="hover:text-brand-400 transition-colors">Gallery</a></li>
              <li><Link to="/admin/login" className="hover:text-brand-400 transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-400" /> Goa, India</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /> hello@resortbook.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ResortBook. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
