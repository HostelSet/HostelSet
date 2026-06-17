import { formatCurrency } from '../lib/utils'

export default function TenantsTab({ 
  filteredTenants, 
  calculateRentDueStatus, 
  getRoomNumberById, 
  vacateRequests, 
  isSubmitting, 
  setConfirmingTenant, 
  setShowPaymentConfirmModal, 
  setSelectedTenant, 
  setShowPaymentModal, 
  fetchTenantPayments, 
  fetchTenantApplication, 
  setTenantToDelete, 
  setShowConfirmDeleteModal 
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Room</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rent</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Paid</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Pending</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTenants.map(t => {
            const dueStatus = calculateRentDueStatus(t)
            const isNoticePeriod = t.status === 'notice_period'
            const isPaymentPending = t.status === 'payment_pending'
            const vacateRequest = vacateRequests.find(v => v.tenant_id === t.id && v.status === 'approved')
            const vacateDate = vacateRequest ? new Date(vacateRequest.expected_check_out) : null
            const daysToVacate = vacateDate ? Math.ceil((vacateDate - new Date()) / (1000 * 60 * 60 * 24)) : null

            return (
              <tr key={t.id} className={`border-b hover:bg-gray-50 ${dueStatus.status === 'overdue' ? 'bg-red-50' : dueStatus.status === 'due_soon' ? 'bg-orange-50' : ''} ${isNoticePeriod ? 'bg-purple-50' : ''} ${isPaymentPending ? 'bg-yellow-50' : ''}`}>
                <td className="px-4 py-3 font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {t.name?.charAt(0).toUpperCase()}
                    </div>
                    <span>{t.name}</span>
                    {isNoticePeriod && <span className="ml-1 text-xs bg-purple-200 text-purple-800 px-1 rounded">Notice</span>}
                    {isPaymentPending && <span className="ml-1 text-xs bg-yellow-200 text-yellow-800 px-1 rounded">Payment Pending</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{t.phone}</td>
                <td className="px-4 py-3 font-medium text-slate-700">Room {t.room_number || getRoomNumberById(t.room_id)}</td>
                <td className="px-4 py-3 font-semibold text-slate-700">{formatCurrency(t.rent_amount)}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">{formatCurrency(t.total_paid || 0)}</td>
                <td className="px-4 py-3 text-red-500 font-semibold">{formatCurrency(t.pending_amount || t.rent_amount)}</td>
                <td className="px-4 py-3">
                  {dueStatus.status === 'overdue' && <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">⚠️ {dueStatus.message}</span>}
                  {dueStatus.status === 'due_soon' && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">📢 {dueStatus.message}</span>}
                  {dueStatus.status === 'pending' && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">💰 {dueStatus.message}</span>}
                  {dueStatus.status === 'paid' && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">✅ {dueStatus.message}</span>}
                  {isNoticePeriod && daysToVacate !== null && daysToVacate > 0 && (
                    <span className="ml-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">🚪 Vacates in {daysToVacate} days</span>
                  )}
                  {isNoticePeriod && daysToVacate !== null && daysToVacate <= 0 && (
                    <span className="ml-1 px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">⚠️ Vacate overdue</span>
                  )}
                  {isPaymentPending && (
                    <span className="ml-1 px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs">⏳ Awaiting approval</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isPaymentPending ? (
                    <button onClick={() => { setConfirmingTenant(t); setShowPaymentConfirmModal(true) }} disabled={isSubmitting} className="bg-yellow-600 text-white px-3 py-1 rounded text-xs mr-2 disabled:opacity-50">Confirm Payment</button>
                  ) : (
                    <>
                      <button onClick={() => { setSelectedTenant(t); setShowPaymentModal(true) }} disabled={isSubmitting} className="bg-slate-800 text-white px-3 py-1 rounded text-xs mr-2 disabled:opacity-50">Collect</button>
                      <button onClick={() => fetchTenantPayments(t)} disabled={isSubmitting} className="bg-blue-600 text-white px-3 py-1 rounded text-xs mr-2 disabled:opacity-50">📜 History</button>
                      <button onClick={() => fetchTenantApplication(t)} disabled={isSubmitting} className="bg-purple-600 text-white px-3 py-1 rounded text-xs mr-2 disabled:opacity-50">👤 Profile</button>
                    </>
                  )}
                  <button onClick={() => { setTenantToDelete(t); setShowConfirmDeleteModal(true) }} disabled={isSubmitting} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition disabled:opacity-50">Delete</button>
                </td>
              </tr>
            )
          })}
          {filteredTenants.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-8 text-gray-500">No tenants match your search</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}