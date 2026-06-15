export const metadata = {
  title: 'About Us | HOSTELSET',
  description: "Learn about HOSTELSET, India's most trusted property management eco-system. Discover our mission to simplify rental tracking, onboarding, and living experiences for landlords and tenants.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          HOSTELSET was born out of a simple realization: managing multi-tenant real estate shouldn't feel like a full-time administration job. Our platform bridges the gap between property owners and modern residents.
        </p>
        <p className="text-gray-500 leading-relaxed">
          Today, we support hundreds of property networks across India's largest student and IT clusters, optimizing operations and eliminating manual book-keeping friction.
        </p>
      </div>
    </div>
  )
}