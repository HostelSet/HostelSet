import { formatCurrency, formatDate } from '../../../lib/utils'

export function ComplaintsTab({ complaints, isSubmitting, setSelectedComplaint, setShowComplaintResponseModal, resolveComplaint }) {
  return (
    <div className="space-y-4">
      {complaints.map(c => (
        <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">{c.priority || 'Medium'}</span>
                <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
              </div>
              <h3 className="font-semibold text-slate-800">{c.title}</h3>
              <p className="text-sm text-gray-500 mt-1">From: {c.tenant_name} | Status: <span className="capitalize font-semibold">{c.status}</span></p>
              <p className="text-gray-600 mt-2">{c.description}</p>
            </div>
            <div className="flex gap-2">
              {c.status === 'open' && <button onClick={() => { setSelectedComplaint(c); setShowComplaintResponseModal(true) }} disabled={isSubmitting} className="bg-slate-800 text-white px-3 py-1 rounded text-sm">Respond</button>}
              {c.status === 'in_progress' && <button onClick={() => resolveComplaint(c.id)} disabled={isSubmitting} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Resolve</button>}
            </div>
          </div>
        </div>
      ))}
      {complaints.length === 0 && <div className="text-center py-12 bg-gray-50 rounded-xl">No active complaints!</div>}
    </div>
  )
}

export function VacateTab({ vacateRequests, isSubmitting, forceDeleteOverdueVacateTenants, autoDeleteExpiredNoticeTenants, loadData, approveVacateRequest }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={async () => { await forceDeleteOverdueVacateTenants(); await autoDeleteExpiredNoticeTenants(); loadData(); }} className="text-xs bg-gray-200 px-3 py-1 rounded-full">Check Now</button>
      </div>
      {vacateRequests.map(req => {
        const daysLeft = Math.ceil((new Date(req.expected_check_out) - new Date()) / (1000 * 60 * 60 * 24))
        return (
          <div key={req.id} className={`bg-white rounded-xl border p-4 ${daysLeft <= 7 ? 'border-red-200 bg-red-50' : 'border-yellow-100'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{req.tenant_name} (Room {req.room_number})</h3>
                <p className="text-sm text-gray-500">Expected Checkout: {formatDate(req.expected_check_out)}</p>
              </div>
              {req.status === 'pending' && (
                <button onClick={() => approveVacateRequest(req.id, req.tenant_id, req.room_id, req.expected_check_out)} disabled={isSubmitting} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Approve</button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function RoomChangeTab({ roomChangeRequests, isSubmitting, approveRoomChange, setSelectedRoomChangeRequest, setShowRoomChangeReasonModal, setRejectionReason }) {
  return (
    <div className="space-y-4">
      {roomChangeRequests.map(request => (
        <div key={request.id} className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{request.tenants?.name}</h3>
              <p className="text-sm text-gray-500">Move Request: Room {request.old_room?.room_number} → Room {request.new_room?.room_number}</p>
              {request.reason && <p className="text-sm bg-gray-50 p-2 rounded mt-2">Reason: {request.reason}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => approveRoomChange(request)} disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Approve</button>
              <button onClick={() => { setSelectedRoomChangeRequest(request); setRejectionReason(''); setShowRoomChangeReasonModal(true); }} disabled={isSubmitting} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">Reject</button>
            </div>
          </div>
        </div>
      ))}
      {roomChangeRequests.length === 0 && <div className="text-center py-12 bg-gray-50 rounded-xl">No pending room changes</div>}
    </div>
  )
}