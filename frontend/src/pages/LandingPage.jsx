import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Quote, Mail, Phone, MapPin, Send } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import ServiceCard from '../components/ServiceCard'
import { CardSkeleton } from '../components/LoadingSkeleton'
import { servicesAPI } from '../services/api'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
}

const gallery = [
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  'https://images.unsplash.com/photo-1564501049512-61c2a3083791?w=600&q=80',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80',
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Business Traveler', text: 'Absolutely stunning property. The booking process was seamless and the ocean view suite exceeded all expectations.', rating: 5 },
  { name: 'Rahul Mehta', role: 'Food Enthusiast', text: 'The rooftop dining experience was magical. ResortBook made reserving our anniversary dinner effortless.', rating: 5 },
  { name: 'Ananya Patel', role: 'Wellness Seeker', text: 'Spa package was divine. From booking to checkout, everything felt premium and personalized.', rating: 5 },
]

export default function LandingPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    servicesAPI.getAll({ available: 'true' })
      .then((res) => setServices(res.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <WhatsAppButton />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-950/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full glass text-white/90 text-sm font-medium mb-6"
          >
            ✨ Luxury Redefined
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          >
            Your Perfect<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-accent-400">Getaway Awaits</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10"
          >
            Book luxury rooms, exclusive dining tables, and premium wellness experiences — all in one elegant platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/book" className="btn-primary text-lg !px-8 !py-4">
              Book Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#services" className="btn-secondary text-lg !px-8 !py-4 !text-white !border-white/30 !bg-white/10 hover:!bg-white/20">
              Explore Services
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <h2 className="section-title mb-4">Our Services</h2>
          <p className="section-subtitle mx-auto">Curated experiences designed for discerning guests</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : services.map((s, i) => (
                <motion.div key={s.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                  <Link to="/book">
                    <ServiceCard service={s} />
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-24 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">Gallery</h2>
            <p className="section-subtitle mx-auto">A glimpse into paradise</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl overflow-hidden ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <h2 className="section-title mb-4">Guest Reviews</h2>
          <p className="section-subtitle mx-auto">Trusted by thousands of happy guests</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="glass-card p-6 relative"
            >
              <Quote className="w-8 h-8 text-brand-200 dark:text-brand-800 mb-4" />
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent-400 text-accent-400" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="section-title mb-4">Get in Touch</h2>
              <p className="section-subtitle mb-8">Have questions? Our concierge team is here to help.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-5 h-5 text-brand-500" /> Beach Road, Calangute, Goa 403516
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Phone className="w-5 h-5 text-brand-500" /> +91 98765 43210
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Mail className="w-5 h-5 text-brand-500" /> hello@resortbook.com
                </div>
              </div>
            </motion.div>
            <motion.form
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass-card p-8 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input className="input-field" placeholder="Your Name" />
              <input className="input-field" type="email" placeholder="Email Address" />
              <textarea className="input-field min-h-[120px] resize-none" placeholder="Your Message" />
              <button type="submit" className="btn-primary w-full">
                Send Message <Send className="w-4 h-4" />
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
