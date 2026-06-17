import { formatCurrency, formatDate } from '../lib/utils'

export function PaymentHistoryTab({ filteredPayments, getRoomNumberById }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tenant</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Room</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Method</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(p.payment_date)}</td>
              <td className="px-4 py-3 font-medium">{p.tenants?.name || 'N/A'}</td>
              <td className="px-4 py-3 text-gray-600">{p.tenants?.rooms?.room_number || getRoomNumberById(p.tenants?.room_id)}</td>
              <td className="px-4 py-3 font-semibold text-green-600">{formatCurrency(p.amount)}</td>
              <td className="px-4 py-3 capitalize text-gray-500">{p.payment_method}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'success' ? 'bg-green-100 text-green-700' : p.status === 'payment_pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                  {p.status === 'success' ? 'Success' : p.status === 'payment_pending' ? 'Pending' : p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PreBookingsTab({ preBookings, isSubmitting, setScreenshotUrl, setShowScreenshotModal, approvePreBooking, rejectPreBooking }) {
  const pending = preBookings.filter(b => b.status === 'pending' && b.payment_status === 'pending')
  return (
    <div className="space-y-4">
      {pending.length === 0 && <div className="text-center py-12 bg-gray-50 rounded-xl">No pending pre‑bookings found.</div>}
      {pending.map(booking => (
        <div key={booking.id} className="bg-white rounded-xl border p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <p className="font-semibold">{booking.name}</p>
            <p className="text-sm text-gray-500">📞 {booking.phone} | 📧 {booking.email || 'No email'}</p>
            <p className="text-sm">Room: {booking.rooms?.room_number || 'N/A'}</p>
            <p className="text-sm font-semibold text-green-600">Fee: {formatCurrency(booking.pre_booking_fee_amount || 0)}</p>
            {booking.payment_screenshot && (
              <button onClick={() => { setScreenshotUrl(booking.payment_screenshot); setShowScreenshotModal(true); }} className="text-blue-600 underline text-sm mt-1 block">View Screenshot</button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => approvePreBooking(booking.id, booking.room_id, booking.user_id)} disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">Approve</button>
            <button onClick={() => rejectPreBooking(booking.id)} disabled={isSubmitting} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">Reject</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ApplicationsTab({ applications, isSubmitting, setSelectedApplication, setShowApplicationDetailModal, approveApplication }) {
  return (
    <div className="space-y-4">
      {applications.map(app => (
        <div key={app.id} className="bg-white rounded-xl border border-gray-100 p-4 flex justify-between items-center hover:shadow-md transition cursor-pointer" onClick={() => { setSelectedApplication(app); setShowApplicationDetailModal(true) }}>
          <div>
            <h3 className="font-semibold text-slate-800">{app.name}</h3>
            <p className="text-sm text-gray-500">📞 {app.phone} | Applied: {formatDate(app.created_at)}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); approveApplication(app.id) }} disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Approve →</button>
        </div>
      ))}
      {applications.length === 0 && <div className="text-center py-12 bg-gray-50 rounded-xl">No pending applications</div>}
    </div>
  )
}