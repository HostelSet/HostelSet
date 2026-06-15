import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from './Layout' // Make sure Layout.js is sitting in your pages folder!

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const checkSession = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const protectedRoutes = ['/owner', '/tenant']
      const isProtectedRoute = protectedRoutes.some(route => router.pathname.startsWith(route))
      
      if (isProtectedRoute && !isLoggedIn && router.pathname !== '/login') {
        router.push('/login')
      }
    }
    checkSession()
  }, [router.pathname])

  // Determine if the current page belongs to the protected administration dashboards
  const isDashboardRoute = router.pathname.startsWith('/owner') || router.pathname.startsWith('/tenant')

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: '#1e293b', color: '#fff', borderRadius: '12px' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      
      {isDashboardRoute ? (
        // Render dashboards bare so they can render their own custom sidebars/menus
        <Component {...pageProps} />
      ) : (
        // Public pages, landing page, and all /footers/* paths get the public navbar + footer
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  )
}