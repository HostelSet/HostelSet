import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex flex-col justify-between">
      {/* MODERN NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3' 
          : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl"
              >
                🏠
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                HOSTELSET
              </span>
            </Link>
            
            {/* DESKTOP NAVIGATION */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="/properties" 
                className="px-5 py-2.5 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:border-slate-800 hover:bg-slate-50 transition-all duration-300 flex items-center gap-2"
              >
                <span>🔍</span> Browse Properties
              </Link>
              
              <Link 
                href="/login" 
                className="px-5 py-2.5 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:border-slate-800 hover:bg-slate-50 transition-all duration-300 flex items-center gap-2"
              >
                <span>👤</span> Login
              </Link>
              
              <Link 
                href="/owner/register-property" 
                className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <span>✨</span> List Property
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-sm z-50"
            >
              <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-40 md:hidden border border-gray-100"
          >
            <div className="p-4 flex flex-col gap-3">
              <Link 
                href="/properties" 
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🔍</span> Browse Properties
              </Link>
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>👤</span> Login
              </Link>
              <Link 
                href="/owner/register-property" 
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>✨</span> List Property
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Main Content injected here */}
      <main className="flex-grow">
        {children}
      </main>

      {/* MODERN FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-16 mt-auto">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏠</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  HOSTELSET
                </span>
              </div>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Set Your Hostel, Simplify Life. India's most trusted PG platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-500">
                <li><Link href="/footers/features" className="hover:text-slate-800 transition">Features</Link></li>
                <li><Link href="/owner/register-property" className="hover:text-slate-800 transition">List Property</Link></li>
                <li><Link href="/login" className="hover:text-slate-800 transition">Login</Link></li>
                <li><Link href="/register" className="hover:text-slate-800 transition">Register</Link></li>
                <li><Link href="/properties" className="hover:text-slate-800 transition">Browse Properties</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-500">
                <li><Link href="/footers/about" className="hover:text-slate-800 transition">About Us</Link></li>
                <li><Link href="/footers/contact" className="hover:text-slate-800 transition">Contact</Link></li>
                <li><Link href="/footers/blog" className="hover:text-slate-800 transition">Blog</Link></li>
                <li><Link href="/footers/careers" className="hover:text-slate-800 transition">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-6 text-lg">Legal</h4>
              <ul className="space-y-3 text-gray-500">
                <li><Link href="/footers/privacy-policy" className="hover:text-slate-800 transition">Privacy Policy</Link></li>
                <li><Link href="/footers/terms-of-service" className="hover:text-slate-800 transition">Terms of Service</Link></li>
                <li><Link href="/footers/cookie-policy" className="hover:text-slate-800 transition">Cookie Policy</Link></li>
                <li><Link href="/footers/refund-policy" className="hover:text-slate-800 transition">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 HOSTELSET. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}