export const metadata = {
  title: 'Contact Our Support Team | HOSTELSET',
  description: 'Have questions about setting up your PG? Contact the HOSTELSET support team available 24/7. Get assistance with onboarding, online payouts, or technical setup.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Get in Touch</h1>
        <p className="text-lg text-gray-600 mb-10">Our deployment teams are here to assist you around the clock.</p>
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 max-w-xl">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-800">✉️ Support Email</h3>
              <p className="text-gray-500 text-sm">support@hostelset.com</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">📱 Corporate Helpline</h3>
              <p className="text-gray-500 text-sm">+91 (80) 4567-8901</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}