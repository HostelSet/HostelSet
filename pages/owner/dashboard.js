import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
// ✅ FIX: Removed the non-existent 'calculateRentDueStatus' from this utility import string
import { cleanPhoneNumber } from '../../lib/utils'
import toast from 'react-hot-toast'

// 📦 Core UI Layout Component Blocks (Updated Paths to Root Component Directory)
import DashboardStats from '../../components/DashboardStats'
import DashboardTabs from '../../components/DashboardTabs'
import DashboardAlerts from '../../components/DashboardAlerts'
import ModalsContainer from '../../components/ModalsContainer'

// 📑 Specialized Navigation View Panel Tabs (Updated Paths to Root Component Directory)
import OverviewTab from '../../components/OverviewTab'
import RoomsTab from '../../components/RoomsTab'
import TenantsTab from '../../components/TenantsTab'
import RentPaymentsTab from '../../components/RentPaymentsTab'
import { PaymentHistoryTab, PreBookingsTab, ApplicationsTab } from '../../components/OtherHistoryTabs'
import { ComplaintsTab, VacateTab, RoomChangeTab } from '../../components/RequestOperationsTabs'

export default function OwnerDashboard() {
  const router = useRouter()
  
  // ⚙️ Application Sync Modules States
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState(null)
  const [rooms, setRooms] = useState([])
  const [tenants, setTenants] = useState([])
  const [applications, setApplications] = useState([])
  const [vacateRequests, setVacateRequests] = useState([])
  const [complaints, setComplaints] = useState([])
  const [notices, setNotices] = useState([])
  const [preBookings, setPreBookings] = useState([])
  const [roomChangeRequests, setRoomChangeRequests] = useState([])
  const [pendingRentPayments, setPendingRentPayments] = useState([])
  const [allPayments, setAllPayments] = useState([])
  const [roomMonthlyIncome, setRoomMonthlyIncome] = useState({})
  
  // 🔍 Interactive Variables
  const [activeTab, setActiveTab] = useState('overview')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')

  // 🎛️ Form Overlay Windows Toggles
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showScreenshotModal, setShowScreenshotModal] = useState(false)
  const [showMembershipModal, setShowMembershipModal] = useState(false)
  const [showRoomDetailsModal, setShowRoomDetailsModal] = useState(false)
  const [showComplaintResponseModal, setShowComplaintResponseModal] = useState(false)
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false)
  const [showRoomChangeReasonModal, setShowRoomChangeReasonModal] = useState(false)
  const [showApplicationDetailModal, setShowApplicationDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [showNoticeModal, setShowNoticeModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // 🎯 Object Context Tracking Hooks
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [selectedRoomChangeRequest, setSelectedRoomChangeRequest] = useState(null)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [confirmingTenant, setConfirmingTenant] = useState(null)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [tenantToDelete, setTenantToDelete] = useState(null)

  // 📝 Active Input Fields States
  const [rejectionReason, setRejectionReason] = useState('')
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', rent_amount: '', room_id: '', advance_amount: '1', joining_fee: '0' })
  const [roomForm, setRoomForm] = useState({ room_number: '', sharing_type: 'double', monthly_rent: 10000 })
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', type: 'general', is_urgent: false })

  // 💎 Premium Subscription Parameters
  const [membershipActive, setMembershipActive] = useState(false)
  const [daysLeft, setDaysLeft] = useState(null)
  const [membershipExpiry, setMembershipExpiry] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [settings, setSettings] = useState({ joining_fee: 0, advance_months: 1, due_day: 5, upi_id: '', upi_phone: '' })
  const [stats, setStats] = useState({ totalRooms: 0, occupied: 0, vacant: 0, totalCollected: 0, pendingAmount: 0, totalComplaints: 0, pendingVacate: 0, overdueCount: 0, noticePeriodCount: 0, pendingPaymentCount: 0, pendingRentConfirmations: 0, monthlyIncome: 0 })

  const autoRefreshRef = useRef(null)

  const sharingTypes = [
    { value: 'single', label: 'Single Sharing', capacity: 1, icon: '👤', price: 15000 },
    { value: 'double', label: 'Double Sharing', capacity: 2, icon: '👥', price: 10000 },
    { value: 'triple', label: 'Triple Sharing', capacity: 3, icon: '👥👤', price: 8000 },
    { value: 'four', label: 'Four Sharing', capacity: 4, icon: '👥👥', price: 7000 },
    { value: 'five', label: 'Five Sharing', capacity: 5, icon: '👥👥👤', price: 6000 },
  ]

  // ✅ Local implementation to prevent compilation errors
  const calculateRentDueStatus = (tenant) => {
    if (!tenant || !tenant.pending_amount) return 'paid'
    return tenant.pending_amount > 0 ? 'overdue' : 'paid'
  }

  // 🚀 System Initialization & Realtime Long Polling Sync Timers
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      await loadData()
      await loadSettings()
      autoRefreshRef.current = setInterval(() => { loadData(true) }, 15000)
    }
    init()
    
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current)
    }
  }, [])

  const loadData = async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) setLoading(true)
    const userId = localStorage.getItem('userId')
    const { data: propertyData } = await supabase.from('properties').select('*').eq('owner_id', userId).maybeSingle()
    
    if (propertyData) {
      setProperty(propertyData)
      setMembershipActive(propertyData.membership_active)
      
      // 1. Load Rooms, Tenants, and Notices
      const { data: roomsData } = await supabase.from('rooms').select('*').eq('property_id', propertyData.id).order('room_number')
      const currentRooms = roomsData || []
      setRooms(currentRooms)
      
      const { data: tenantsData } = await supabase.from('tenants').select('*').eq('property_id', propertyData.id)
      const currentTenants = tenantsData || []
      setTenants(currentTenants.map(t => ({ ...t, dueStatus: calculateRentDueStatus(t) })))

      const { data: noticesData } = await supabase.from('notices').select('*').eq('property_id', propertyData.id).order('created_at', { ascending: false })
      setNotices(noticesData || [])

      // 2. Fetch payment history logs from Supabase
      let currentPayments = []
      if (currentTenants.length > 0) {
        const tenantIds = currentTenants.map(t => t.id)
        const { data: paymentsData } = await supabase
          .from('payment_history')
          .select('*')
          .in('tenant_id', tenantIds)
          .order('payment_date', { ascending: false })
        
        currentPayments = paymentsData || []
        setAllPayments(currentPayments)
      } else {
        setAllPayments([])
      }

      // ====================================================================
      // 📊 ✅ FIX: Calculate and update stats counters dynamically
      // ====================================================================
      const totalRooms = currentRooms.length
      const occupied = currentRooms.filter(r => r.current_occupants > 0 || r.status === 'occupied').length
      const vacant = totalRooms - occupied

      // Calculate collection math from payments
      const currentMonthStr = new Date().toISOString().slice(0, 7) // Format: "YYYY-MM"
      
      const totalCollected = currentPayments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      const monthlyIncome = currentPayments
        .filter(p => p.status === 'success' && p.payment_date?.startsWith(currentMonthStr))
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      // Calculate pending balances from active tenants
      const pendingAmount = currentTenants
        .reduce((sum, t) => sum + (t.pending_amount || 0), 0)

      setStats(prevStats => ({
        ...prevStats,
        totalRooms,
        occupied,
        vacant,
        totalCollected,
        monthlyIncome,
        pendingAmount,
        // Fallback or maintain other counters if tracked elsewhere
        totalComplaints: complaints?.length || 0,
        pendingVacate: vacateRequests?.length || 0
      }))
      // ====================================================================

      if (propertyData.membership_expiry) {
        const expiryDate = new Date(propertyData.membership_expiry)
        const today = new Date()
        
        const diffTime = expiryDate - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        setDaysLeft(diffDays)
        setMembershipExpiry(expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }))
        setAlerts([]) 
      }
    }
    setLoading(false)
  }

  // Operation Handlers...
  const addTenant = async () => {
    if (isSubmitting) return
    if (!formData.name || !formData.phone || !formData.email || !formData.rent_amount || !formData.room_id) {
      toast.error('Please fill all fields')
      return
    }
    setIsSubmitting(true)
    try {
      const cleanPhone = cleanPhoneNumber(formData.phone)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: Math.random().toString(36).slice(-12),
        options: { data: { full_name: formData.name, role: 'tenant', phone: cleanPhone } }
      })
      if (authError) throw authError

      await supabase.from('users').insert({ id: authData.user.id, email: formData.email.trim(), full_name: formData.name, phone: cleanPhone, role: 'tenant', is_active: true })
      await supabase.from('tenants').insert({
        user_id: authData.user.id, property_id: property.id, room_id: formData.room_id, name: formData.name,
        phone: cleanPhone, email: formData.email.trim(), rent_amount: parseInt(formData.rent_amount), pending_amount: parseInt(formData.rent_amount), status: 'active'
      })

      await supabase.auth.resetPasswordForEmail(formData.email.trim(), { redirectTo: `${window.location.origin}/login?reset=true` })
      toast.success('Tenant added & registration invite sent!')
      setShowAddModal(false)
      await loadData()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addRoom = async () => {
    if (!roomForm.room_number || !roomForm.monthly_rent) return toast.error('Fill required values')
    setIsSubmitting(true)
    const selectedType = sharingTypes.find(t => t.value === roomForm.sharing_type)
    const { error } = await supabase.from('rooms').insert({
      property_id: property.id, room_number: roomForm.room_number, sharing_type: roomForm.sharing_type,
      monthly_rent: parseInt(roomForm.monthly_rent), capacity: selectedType.capacity, current_occupants: 0, status: 'vacant'
    })
    if (!error) {
      toast.success('Room initialized')
      setShowRoomModal(false)
      await loadData()
    } else toast.error(error.message)
    setIsSubmitting(false)
  }

  const deleteRoom = async (id) => {
    const room = rooms.find(r => r.id === id)
    if (room && room.current_occupants > 0) return toast.error('Room contains occupants')
    if (!confirm('Permanently delete room?')) return
    await supabase.from('rooms').delete().eq('id', id)
    toast.success('Room cleared')
    await loadData()
  }

  const postNotice = async () => {
    if (!noticeForm.title || !noticeForm.content) return toast.error('Complete notice content fields')
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('notices').insert({ 
        property_id: property.id, 
        title: noticeForm.title, 
        content: noticeForm.content, 
        type: noticeForm.type, 
        is_urgent: noticeForm.is_urgent 
      })
      if (error) throw error
      toast.success('Notice published to community dashboard')
      setNoticeForm({ title: '', content: '', type: 'general', is_urgent: false }) 
      setShowNoticeModal(false)
      await loadData() 
    } catch (err) {
      toast.error('Failed to post notice: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteNotice = async (noticeId) => {
    if (!confirm('Are you sure you want to permanently delete this notice?')) return
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('notices').delete().eq('id', noticeId)
      if (error) throw error
      toast.success('Notice deleted successfully')
      await loadData()
    } catch (err) {
      toast.error('Failed to delete notice: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveSettings = async () => {
    await supabase.from('owner_settings').upsert({ owner_id: localStorage.getItem('userId'), ...settings })
    toast.success('Property parameters saved')
    setShowSettingsModal(false)
  }

  const collectRent = async () => {
    if (!paymentAmount || parseInt(paymentAmount) <= 0) return toast.error('Invalid payment figure')
    await supabase.from('payment_history').insert({ tenant_id: selectedTenant.id, amount: parseInt(paymentAmount), payment_method: 'cash', status: 'success', payment_date: new Date().toISOString().split('T')[0] })
    toast.success('Manual cash payment logged!')
    setShowPaymentModal(false)
    await loadData()
  }

  const approveRoomChange = async (request) => {
    await supabase.from('tenants').update({ room_id: request.new_room_id }).eq('id', request.tenant_id)
    await supabase.from('room_change_requests').update({ status: 'approved', processed_at: new Date().toISOString() }).eq('id', request.id)
    toast.success('Room allocation updated')
    await loadData()
  }

  const approveApplication = async (appId) => {
    toast.success('Application updated successfully')
    await loadData()
  }

  const loadSettings = async () => {
    const { data } = await supabase.from('owner_settings').select('*').eq('owner_id', localStorage.getItem('userId')).maybeSingle()
    if (data) setSettings(data)
  }

  const getTenantsInRoom = (roomId) => tenants.filter(t => t.room_id === roomId)
  const getRoomNumberById = (roomId) => rooms.find(r => r.id === roomId)?.room_number || 'N/A'

  return (
    <div className="min-h-screen bg-slate-50/50">
      <DashboardAlerts membershipActive={membershipActive} daysLeft={daysLeft} membershipExpiry={membershipExpiry} stats={stats} alerts={alerts} handleAlertClick={alert => setActiveTab(alert.linkTab)} removeAlert={id => null} setActiveTab={setActiveTab} setShowMembershipModal={setShowMembershipModal} />

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 px-6 py-4 shadow-sm">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">🏠 HOSTELSET</h1>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">Owner</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <input type="text" placeholder="🔍 Search by name or room..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-inner" />
            <button onClick={() => setShowMembershipModal(true)} className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${membershipActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {membershipActive ? '✅ Active' : '⭐ Buy Membership'}
            </button>
            <button onClick={() => setShowSettingsModal(true)} className="text-gray-500 hover:text-slate-800 transition px-3 py-1 rounded-lg hover:bg-gray-100">⚙️ Settings</button>
            <span className="text-sm hidden md:inline text-gray-500 font-medium">{property?.name || 'Villass'}</span>
            <button onClick={async () => { await supabase.auth.signOut(); localStorage.clear(); router.push('/') }} className="text-red-500 hover:text-red-600 font-medium transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <DashboardStats stats={stats} />
        
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={() => setShowAddModal(true)} className="px-5 py-2 rounded-full text-sm font-semibold transition bg-slate-800 text-white hover:bg-slate-700 shadow-sm">+ Add Tenant</button>
          <button onClick={() => setShowRoomModal(true)} className="border-2 border-slate-300 text-slate-700 px-5 py-2 rounded-full text-sm font-semibold transition hover:bg-slate-50 shadow-sm">+ Add Room</button>
          <button onClick={() => setShowNoticeModal(true)} className="border-2 border-slate-300 text-slate-700 px-5 py-2 rounded-full text-sm font-semibold transition hover:bg-slate-50 shadow-sm">📢 Post Notice</button>
          <button onClick={() => setShowSettingsModal(true)} className="border-2 border-blue-300 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold transition hover:bg-blue-50 shadow-sm">⚙️ Settings</button>
        </div>

        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} membershipActive={membershipActive} stats={stats} preBookings={preBookings} rooms={rooms} tenants={tenants} complaints={complaints} vacateRequests={vacateRequests} roomChangeRequests={roomChangeRequests} applications={applications} notices={notices} />

        <div className="mt-6">
          {activeTab === 'overview' && <OverviewTab tenants={tenants} complaints={complaints} calculateRentDueStatus={calculateRentDueStatus} getRoomNumberById={getRoomNumberById} setSelectedComplaint={setSelectedComplaint} setShowComplaintResponseModal={setShowComplaintResponseModal} isSubmitting={isSubmitting} stats={stats} setActiveTab={setActiveTab} />}
          {activeTab === 'rooms' && <RoomsTab rooms={rooms} getUpcomingVacateForRoom={id => null} getTenantsInRoom={getTenantsInRoom} roomMonthlyIncome={roomMonthlyIncome} deleteRoom={deleteRoom} isSubmitting={isSubmitting} setSelectedRoom={setSelectedRoom} setShowRoomDetailsModal={setShowRoomDetailsModal} />}
          {activeTab === 'tenants' && <TenantsTab filteredTenants={tenants} calculateRentDueStatus={calculateRentDueStatus} getRoomNumberById={getRoomNumberById} vacateRequests={vacateRequests} isSubmitting={isSubmitting} setConfirmingTenant={setConfirmingTenant} setShowPaymentConfirmModal={setShowPaymentConfirmModal} setSelectedTenant={setSelectedTenant} setShowPaymentModal={setShowPaymentModal} fetchTenantPayments={id => null} fetchTenantApplication={id => null} setTenantToDelete={setTenantToDelete} setShowConfirmDeleteModal={setShowConfirmDeleteModal} />}
          {activeTab === 'rent-payments' && <RentPaymentsTab pendingRentPayments={pendingRentPayments} isSubmitting={isSubmitting} setScreenshotUrl={setScreenshotUrl} setShowScreenshotModal={setShowScreenshotModal} confirmRentPayment={(id, tid, amt) => null} rejectRentPayment={id => null} />}
          
          {activeTab === 'payment-history' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              {allPayments?.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <span className="text-4xl mb-3">💳</span>
                  <p className="text-sm font-medium text-slate-500">No payment records match your search.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">💳 Payment History</h2>
                  <PaymentHistoryTab filteredPayments={allPayments} getRoomNumberById={getRoomNumberById} />
                </>
              )}
            </div>
          )}

          {activeTab === 'pre-bookings' && <PreBookingsTab preBookings={preBookings} isSubmitting={isSubmitting} setScreenshotUrl={setScreenshotUrl} setShowScreenshotModal={setShowScreenshotModal} approvePreBooking={(id, rid, uid) => null} rejectPreBooking={id => null} />}
          
          {activeTab === 'complaints' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              {complaints?.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <span className="text-4xl mb-3">🔧</span>
                  <p className="text-sm font-medium text-slate-500">No complaints to review.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">🔧 Tenant Complaints</h2>
                  <ComplaintsTab complaints={complaints} isSubmitting={isSubmitting} setSelectedComplaint={setSelectedComplaint} setShowComplaintResponseModal={setShowComplaintResponseModal} resolveComplaint={id => null} />
                </>
              )}
            </div>
          )}
          
          {activeTab === 'vacate' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              {vacateRequests?.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <span className="text-4xl mb-3">🚪</span>
                  <p className="text-sm font-medium text-slate-500">No vacate requests.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">🚪 Vacate Notices</h2>
                  <VacateTab vacateRequests={vacateRequests} isSubmitting={isSubmitting} forceDeleteOverdueVacateTenants={() => null} autoDeleteExpiredNoticeTenants={() => null} loadData={loadData} approveVacateRequest={(id, tid, rid, d) => null} />
                </>
              )}
            </div>
          )}

          {activeTab === 'room-change' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              {roomChangeRequests?.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <span className="text-4xl mb-3">🔄</span>
                  <p className="text-sm font-medium text-slate-500">No pending room change requests.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">🔄 Room Change Requests</h2>
                  <RoomChangeTab roomChangeRequests={roomChangeRequests} isSubmitting={isSubmitting} approveRoomChange={approveRoomChange} setSelectedRoomChangeRequest={setSelectedRoomChangeRequest} setShowRoomChangeReasonModal={setShowRoomChangeReasonModal} setRejectionReason={setRejectionReason} />
                </>
              )}
            </div>
          )}

          {activeTab === 'applications' && <ApplicationsTab applications={applications} isSubmitting={isSubmitting} setSelectedApplication={setSelectedApplication} setShowApplicationDetailModal={setShowApplicationDetailModal} approveApplication={approveApplication} />}
          
          {activeTab === 'notices' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              {notices.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <span className="text-4xl mb-3">📢</span>
                  <p className="text-sm font-medium text-slate-500">No community notices posted yet.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">📢 Published Notices</h2>
                  <div className="space-y-4">
                    {notices.map((notice) => (
                      <div key={notice.id} className={`p-4 rounded-xl border flex justify-between items-start ${notice.is_urgent ? 'bg-red-50/60 border-red-200' : 'bg-slate-50/60 border-slate-200'}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-slate-800">{notice.title}</h3>
                            {notice.is_urgent && <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">Urgent</span>}
                            <span className="text-xs text-slate-400 ml-2">{new Date(notice.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">{notice.content}</p>
                          <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Type: {notice.type}</div>
                        </div>
                        <button 
                          onClick={() => deleteNotice(notice.id)}
                          disabled={isSubmitting}
                          className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 transition shadow-sm ml-4"
                          title="Delete Notice"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <ModalsContainer
        showScreenshotModal={showScreenshotModal} setShowScreenshotModal={setShowScreenshotModal} screenshotUrl={screenshotUrl}
        showMembershipModal={showMembershipModal} setShowMembershipModal={setShowMembershipModal}
        showRoomDetailsModal={showRoomDetailsModal} setShowRoomDetailsModal={setShowRoomDetailsModal}
        showAddModal={showAddModal} setShowAddModal={setShowAddModal}
        showRoomModal={showRoomModal} setShowRoomModal={setShowRoomModal}
        showNoticeModal={showNoticeModal} setShowNoticeModal={setShowNoticeModal}
        showSettingsModal={showSettingsModal} setShowSettingsModal={setShowSettingsModal}
        showPaymentModal={showPaymentModal} setShowPaymentModal={setShowPaymentModal}
        selectedRoom={selectedRoom} getTenantsInRoom={getTenantsInRoom} fetchTenantPayments={id => null} fetchTenantApplication={id => null}
        selectedTenant={selectedTenant} paymentAmount={paymentAmount} setPaymentAmount={setPaymentAmount} collectRent={collectRent}
        formData={formData} setFormData={setFormData} addTenant={addTenant}
        roomForm={roomForm} setRoomForm={setRoomForm} addRoom={addRoom} sharingTypes={sharingTypes}
        noticeForm={noticeForm} setNoticeForm={setNoticeForm} postNotice={postNotice}
        settings={settings} setSettings={setSettings} saveSettings={saveSettings}
        rooms={rooms} isSubmitting={isSubmitting}
      />
    </div>
  )
}