import { formatCurrency, formatDate } from '../../../lib/utils'

export default function RentPaymentsTab({ pendingRentPayments, isSubmitting, setScreenshotUrl, setShowScreenshotModal, confirmRentPayment, rejectRentPayment }) {
  return (
    <div className="space-y-4">
      {pendingRentPayments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">No pending rent payments.</div>
      )}
      {pendingRentPayments.map(p => (
        <div key={p.id} className="bg-white rounded-xl border p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <p className="font-semibold">{p.tenants?.name || 'N/A'}</p>
            <p className="text-sm text-gray-500">Room {p.tenants?.rooms?.room_number || 'N/A'}</p>
            <p className="text-sm">Amount: {formatCurrency(p.amount)}</p>
            <p className="text-sm">Date: {formatDate(p.payment_date)}</p>
            {p.upi_transaction_id && <p className="text-xs text-gray-500">UTR: {p.upi_transaction_id}</p>}
            {p.payment_screenshot && (
              <div className="mt-2">
                <button onClick={() => { setScreenshotUrl(p.payment_screenshot); setShowScreenshotModal(true); }} className="text-blue-600 underline text-sm">View Screenshot</button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => confirmRentPayment(p.id, p.tenant_id, p.amount)} disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50">Received</button>
            <button onClick={() => rejectRentPayment(p.id)} disabled={isSubmitting} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50">Not Received</button>
          </div>
        </div>
      ))}
    </div>
  )
}