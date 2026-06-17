import { formatCurrency, formatDate } from '../lib/utils'

export default function OverviewTab({ tenants, complaints, calculateRentDueStatus, getRoomNumberById, setSelectedComplaint, setShowComplaintResponseModal, isSubmitting, stats, setActiveTab }) {
  return (
    <div>
      {stats.pendingRentConfirmations > 0 && (
        <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
          <p className="font-semibold text-red-800">💸 {stats.pendingRentConfirmations} rent payment(s) awaiting confirmation. <button onClick={() => setActiveTab('rent-payments')} className="underline">Review</button></p>
        </div>
      )}
      {stats.pendingPaymentCount > 0 && (
        <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
          <p className="font-semibold text-red-800">⚠️ {stats.pendingPaymentCount} tenant(s) awaiting payment confirmation. <button onClick={() => setActiveTab('tenants')} className="underline">Review</button></p>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 className="font-semibold text-slate-800 mb-4">📅 Due Today</h3>
        {tenants.filter(t => calculateRentDueStatus(t).daysUntilDue === 0).length === 0 ? (
          <p className="text-gray-500">No tenants due today.</p>
        ) : (
          <div className="space-y-3">
            {tenants.filter(t => calculateRentDueStatus(t).daysUntilDue === 0).map(t => (
              <div key={t.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-700">{t.name}</p>
                  <p className="text-xs text-gray-400">Room {t.room_number || getRoomNumberById(t.room_id)}</p>
                </div>
                <p className="text-sm font-semibold text-red-600">Due: {formatCurrency(t.pending_amount || t.rent_amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">📋 Recent Tenants</h3>
          <div className="space-y-3">
            {tenants.slice(0, 5).map(t => {
              const ds = calculateRentDueStatus(t)
              return (
                <div key={t.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-700">{t.name}</p>
                    <p className="text-xs text-gray-400">Room {t.room_number || getRoomNumberById(t.room_id)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-700">{formatCurrency(t.rent_amount)}</p>
                    <p className={`text-xs ${ds.status === 'overdue' ? 'text-red-500' : ds.status === 'due_soon' ? 'text-orange-500' : 'text-green-500'}`}>{ds.message}</p>
                  </div>
                </div>
              )
            })}
            {tenants.length === 0 && <p className="text-gray-400 text-center py-4">No tenants yet</p>}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">🔧 Recent Complaints</h3>
          <div className="space-y-3">
            {complaints.slice(0, 5).map(c => (
              <div key={c.id} className="p-3 bg-orange-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-orange-700">{c.title}</p>
                    <p className="text-xs text-gray-500 mt-1">From: {c.tenant_name}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedComplaint(c); setShowComplaintResponseModal(true) }}
                    disabled={isSubmitting}
                    className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 disabled:opacity-50"
                  >
                    Respond
                  </button>
                </div>
              </div>
            ))}
            {complaints.length === 0 && <p className="text-gray-400 text-center py-4">No complaints yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}