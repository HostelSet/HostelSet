export const metadata = {
  title: 'Privacy Policy | HOSTELSET',
  description: 'Your data privacy matters to us. Read the HOSTELSET privacy policy to understand how we secure, process, and protect your personal, banking, and property records.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl prose prose-slate">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-6">Last updated: June 2026</p>
        <p className="text-gray-600 mb-4">
          At HOSTELSET, we collect and process data required to authenticate user sessions, process payments, and sync system dashboards securely.
        </p>
        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">1. Information We Collect</h3>
        <p className="text-gray-600 text-sm">
          This includes property addresses, room dimensions, tenant contact details, payment logs, and access credentials explicitly provided during platform execution. All financial processing runs through certified bank gateways.
        </p>
      </div>
    </div>
  )
}