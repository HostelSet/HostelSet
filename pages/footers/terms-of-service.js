export const metadata = {
  title: 'Terms of Service | HOSTELSET',
  description: 'Review the terms of service governing your use of the HOSTELSET software platform, premium memberships, subscription rules, and property dashboard access.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-6">Last updated: June 2026</p>
        <p className="text-gray-600 text-sm leading-relaxed">
          By utilizing HOSTELSET tools, you agree to comply with platform usage conditions. Landlords are completely accountable for the factual accuracy of listings, pricing configurations, and local rental legal conformities managed through our software wrappers.
        </p>
      </div>
    </div>
  )
}