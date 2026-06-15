export const metadata = {
  title: 'The HOSTELSET Blog | PG Management Tips & Insights',
  description: 'Read the latest trends, regulatory updates, tax strategies, and optimization tips on running a successful paying guest and hostel business in India.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-10">Resource Center</h1>
        <div className="space-y-8">
          <article className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-semibold text-slate-400">June 2026</span>
            <h3 className="text-xl font-bold text-slate-800 mt-1 mb-2">Maximizing High-Density Rental Yields</h3>
            <p className="text-gray-500 text-sm">How modern layouts and value-added amenities attract long-term working professionals.</p>
          </article>
        </div>
      </div>
    </div>
  )
}