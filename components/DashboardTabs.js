export default function DashboardTabs({ 
  activeTab, 
  setActiveTab, 
  membershipActive, 
  stats, 
  preBookings = [], 
  rooms = [], 
  tenants = [], 
  complaints = [], 
  vacateRequests = [], 
  roomChangeRequests = [], 
  applications = [], 
  notices = [] 
}) {
  
  // ✅ FIX: Cleanly isolated exact labels from numbers, eliminating string collision risks
  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: '📊', showCount: false, countValue: 0, badgeValue: 0 },
    { id: 'rooms', label: 'Rooms', icon: '🏠', showCount: true, countValue: rooms?.length || 0, badgeValue: 0 },
    { id: 'tenants', label: 'Tenants', icon: '👥', showCount: true, countValue: tenants?.length || 0, badgeValue: 0 },
    { id: 'rent-payments', label: 'Rent Payments', icon: '💸', showCount: false, countValue: 0, badgeValue: stats?.pendingRentConfirmations || 0 },
    { id: 'payment-history', label: 'Payment History', icon: '💳', showCount: false, countValue: 0, badgeValue: 0 },
    { id: 'pre-bookings', label: 'Pre‑bookings', icon: '📋', showCount: false, countValue: 0, badgeValue: preBookings?.filter(b => b.status === 'pending' && b.payment_status === 'pending').length || 0 },
    { id: 'complaints', label: 'Complaints', icon: '🔧', showCount: false, countValue: 0, badgeValue: stats?.totalComplaints || 0 },
    { id: 'vacate', label: 'Vacate', icon: '🚪', showCount: false, countValue: 0, badgeValue: stats?.pendingVacate || 0 },
    { id: 'room-change', label: 'Room Change', icon: '🔄', showCount: false, countValue: 0, badgeValue: roomChangeRequests?.length || 0 },
    { id: 'applications', label: 'Applications', icon: '📋', showCount: false, countValue: 0, badgeValue: applications?.length || 0 },
    { id: 'notices', label: 'Notices', icon: '📢', showCount: true, countValue: notices?.length || 0, badgeValue: 0 }
  ]

  return (
    <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-2" suppressHydrationWarning>
      {tabsConfig.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          disabled={!membershipActive && tab.id !== 'overview'}
          className={`px-4 py-2.5 text-sm font-semibold transition-all rounded-t-lg flex items-center gap-2 relative border-b-2 ${
            activeTab === tab.id 
              ? 'bg-slate-800 text-white border-slate-800 shadow-sm z-10' 
              : membershipActive 
                ? 'text-gray-500 border-transparent hover:text-slate-700 hover:bg-gray-50' 
                : tab.id === 'overview'
                  ? 'text-gray-500 border-transparent hover:text-slate-700'
                  : 'text-gray-400 border-transparent cursor-not-allowed opacity-50'
          }`}
        >
          {/* Render Tab Icon */}
          <span className="select-none text-base" role="img" aria-hidden="true">
            {tab.icon}
          </span>
          
          {/* Render Tab Text Label with Safe Check flags */}
          <span>
            {tab.label} {tab.showCount ? `(${tab.countValue})` : ''}
          </span>
          
          {/* Render Dynamic Notification Badge Pill */}
          {tab.badgeValue > 0 && (
            <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full transition-colors ${
              activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
            }`}>
              {tab.badgeValue}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}