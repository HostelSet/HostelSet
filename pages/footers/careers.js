export const metadata = {
  title: 'Careers - Join the Team | HOSTELSET',
  description: 'Build the future of property technology. Explore open technical, operational, and customer success positions at HOSTELSET and join a fast-paced, remote-first crew.',
}

export default function CareersPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Build the Future of PropTech</h1>
        <p className="text-lg text-gray-600 mb-8">We are looking for creators, systems architects, and designers to revolutionize rental infrastructure.</p>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center">
          <p className="text-slate-600 font-medium">No open positions matching current cycles. Check back soon!</p>
        </div>
      </div>
    </div>
  )
}