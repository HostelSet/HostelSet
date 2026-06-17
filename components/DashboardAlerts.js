import { formatDate } from '../lib/utils'

export default function DashboardAlerts({ 
  membershipActive, 
  daysLeft, 
  membershipExpiry, 
  stats, 
  alerts, 
  handleAlertClick, 
  removeAlert, 
  setActiveTab, 
  setShowMembershipModal 
}) {
  return (
    <>
      {/* ==================== PREMIUM PAYWALL WARNING BANNER ==================== */}
      {!membershipActive && (
        <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-3 text-center sticky top-0 z-50">
          <p className="text-yellow-800 font-semibold text-xs md:text-sm">
            ⭐ You're exploring the dashboard with limited access. 
            <button onClick={() => setShowMembershipModal(true)} className="ml-2 underline font-bold hover:text-yellow-950 transition">
              Subscribe now
            </button> to unlock all features.
          </p>
        </div>
      )}

      {/* ==================== MEMBERSHIP CRITICAL EXPIRY BANNER ==================== */}
      {membershipActive && daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && (
        <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-3 text-center sticky top-0 z-50">
          <p className="text-yellow-800 font-semibold text-xs md:text-sm">
            ⚠️ Your membership will expire in {daysLeft} days on {formatDate(membershipExpiry)}. 
            <button onClick={() => setShowMembershipModal(true)} className="ml-2 underline font-bold hover:text-yellow-950 transition">Renew now</button>
          </p>
        </div>
      )}

      {/* ==================== TENANT OUTSTANDING DEBT ALERTS ==================== */}
      {stats?.pendingPaymentCount > 0 && (
        <div className="bg-red-100 border-b border-red-300 px-4 py-3 text-center">
          <p className="text-red-800 font-semibold text-xs md:text-sm">
            ⚠️ You have {stats.pendingPaymentCount} pending payment(s). 
            <button onClick={() => setActiveTab('tenants')} className="ml-2 underline text-red-900 font-bold hover:text-red-950 transition">Review now</button>
          </p>
        </div>
      )}

      {/* ==================== TOAST NOTIFICATION REALTIME QUEUE LIST ==================== */}
      {alerts?.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
          <div className="container mx-auto">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">🔔 Notifications</h3>
            <div className="space-y-1.5">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-2 cursor-pointer transition border border-slate-100" onClick={() => handleAlertClick(alert)}>
                  <span className="text-xs font-medium text-slate-700">{alert.message}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeAlert(alert.id); }} className="text-gray-400 hover:text-red-600 text-sm pl-2 p-1 transition">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}