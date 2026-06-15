export const metadata = {
  title: 'Platform Features | HOSTELSET',
  description: 'Explore the modern toolset built for Indian PG and hostel owners. Automate your rent collections, track tenant entries, manage rooms, and get real-time business insights.',
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Platform Features</h1>
        <p className="text-lg text-gray-600 mb-8">
          HOSTELSET is engineered to handle the complexities of modern student and working-professional housing management.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">Smart Reminders</h3>
            <p className="text-gray-500 text-sm">Automated WhatsApp and SMS alerts directly to tenants when rent cycles are due.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">Expense Reconciliation</h3>
            <p className="text-gray-500 text-sm">Log utility bills, maintenance fees, and payroll to view real-time monthly margins.</p>
          </div>
        </div>
      </div>
    </div>
  )
}