import { AnimatePresence } from 'framer-motion'

export default function ModalsContainer({
  // Toggles Visibility Flags
  showScreenshotModal, setShowScreenshotModal, screenshotUrl,
  showMembershipModal, setShowMembershipModal,
  showRoomDetailsModal, setShowRoomDetailsModal,
  showAddModal, setShowAddModal,
  showRoomModal, setShowRoomModal,
  showNoticeModal, setShowNoticeModal,
  showSettingsModal, setShowSettingsModal,
  showPaymentModal, setShowPaymentModal,

  // Selected Item Context Hooks
  selectedRoom, getTenantsInRoom, fetchTenantPayments, fetchTenantApplication,
  selectedTenant,

  // Dynamic Variable Inputs Handlers
  formData, setFormData, addTenant,
  roomForm, setRoomForm, addRoom, sharingTypes,
  noticeForm, setNoticeForm, postNotice,
  settings, setSettings, saveSettings,
  paymentAmount, setPaymentAmount, collectRent,
  rooms = [],
  
  // Global Request Monitor Flag
  isSubmitting
}) {
  return (
    <AnimatePresence>
      {/* ==================== 1. VIEW SCREENSHOT MODAL ==================== */}
      {showScreenshotModal && screenshotUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4" onClick={() => setShowScreenshotModal(false)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowScreenshotModal(false)} className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300">✕</button>
            <img src={screenshotUrl} alt="Screenshot Proof" className="w-full rounded-lg shadow-2xl max-h-[85vh] object-contain" />
          </div>
        </div>
      )}

      {/* ==================== 2. ADD TENANT MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Add New Tenant</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-slate-800" value={formData?.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="Phone Number *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-slate-800" value={formData?.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} maxLength={10} />
              <input type="email" placeholder="Email Address * (Required for setup link)" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-slate-800" value={formData?.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="number" placeholder="Monthly Rent (₹) *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-slate-800" value={formData?.rent_amount || ''} onChange={(e) => setFormData({...formData, rent_amount: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Advance Months</label>
                  <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" value={formData?.advance_amount || '1'} onChange={(e) => setFormData({...formData, advance_amount: e.target.value})} min="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Joining Fee (₹)</label>
                  <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" value={formData?.joining_fee || '0'} onChange={(e) => setFormData({...formData, joining_fee: e.target.value})} min="0" />
                </div>
              </div>

              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white" value={formData?.room_id || ''} onChange={(e) => setFormData({...formData, room_id: e.target.value})}>
                <option value="">Select Room Assignment</option>
                {rooms?.filter(r => r.current_occupants < r.capacity).map(room => (
                  <option key={room.id} value={room.id}>Room {room.room_number} - ({room.capacity - room.current_occupants} slots available)</option>
                ))}
              </select>

              <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-700">
                📌 After addition completes, an auto-generated password reset configuration link will be dispatched to this email workspace.
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={addTenant} disabled={isSubmitting} className="flex-1 bg-slate-800 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-slate-700 transition">{isSubmitting ? 'Adding...' : 'Add Tenant'}</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. ADD ROOM MODAL ==================== */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRoomModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Add New Room</h2>
              <button onClick={() => setShowRoomModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Room Number (e.g., 101) *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-slate-800" value={roomForm?.room_number || ''} onChange={(e) => setRoomForm({...roomForm, room_number: e.target.value})} />
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white" value={roomForm?.sharing_type || 'double'} onChange={(e) => setRoomForm({...roomForm, sharing_type: e.target.value})}>
                {sharingTypes?.map(type => (
                  <option key={type.value} value={type.value}>{type.label} {type.icon}</option>
                ))}
              </select>
              <input type="number" placeholder="Target Monthly Rent (₹) *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-slate-800" value={roomForm?.monthly_rent || ''} onChange={(e) => setRoomForm({...roomForm, monthly_rent: e.target.value})} />
              
              <div className="flex gap-3 pt-2">
                <button onClick={addRoom} disabled={isSubmitting} className="flex-1 bg-slate-800 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-slate-700 transition">Add Room</button>
                <button onClick={() => setShowRoomModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. COLLECT RENT MODAL ==================== */}
      {showPaymentModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-slate-800">Collect Rent Manually</h2>
            <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm space-y-1">
              <p className="font-semibold text-slate-700">{selectedTenant.name}</p>
              <p className="text-slate-500">Rent Profile: ₹{selectedTenant.rent_amount}</p>
              <p className="text-red-500 font-medium">Pending Balance: ₹{selectedTenant.pending_amount || selectedTenant.rent_amount}</p>
            </div>
            <input type="number" placeholder="Enter Amount Collected (₹)" className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 text-sm focus:outline-none focus:border-slate-800" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={collectRent} disabled={isSubmitting} className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-green-700 transition">{isSubmitting ? 'Processing...' : 'Confirm Payment'}</button>
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 5. POST NOTICE MODAL ==================== */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNoticeModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Post Community Notice</h2>
              <button onClick={() => setShowNoticeModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Notice Title *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-slate-800" value={noticeForm?.title || ''} onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})} />
              <textarea placeholder="Notice Body Content Details... *" rows="4" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-slate-800" value={noticeForm?.content || ''} onChange={(e) => setNoticeForm({...noticeForm, content: e.target.value})} />
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white" value={noticeForm?.type || 'general'} onChange={(e) => setNoticeForm({...noticeForm, type: e.target.value})}>
                <option value="general">General</option>
                <option value="maintenance">Maintenance Update</option>
                <option value="payment">Payment Alert</option>
                <option value="emergency">Emergency Broadcast</option>
              </select>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={noticeForm?.is_urgent || false} onChange={(e) => setNoticeForm({...noticeForm, is_urgent: e.target.checked})} className="w-4 h-4 rounded text-slate-800" />
                <span className="text-xs font-semibold text-red-600">Mark flag as High Priority / Urgent</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={postNotice} disabled={isSubmitting} className="flex-1 bg-slate-800 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-slate-700 transition">Publish Notice</button>
                <button onClick={() => setShowNoticeModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 6. PROPERTY SETTINGS MODAL ==================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">⚙️ Property Settings</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Standard Joining Fee (₹)</label>
                <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" value={settings?.joining_fee || 0} onChange={(e) => setSettings({...settings, joining_fee: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Advance Months Required</label>
                <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" value={settings?.advance_months || 1} onChange={(e) => setSettings({...settings, advance_months: parseInt(e.target.value) || 0})} min="0" max="12" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Alert Threshold (Days before due date)</label>
                <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" value={settings?.due_day || 5} onChange={(e) => setSettings({...settings, due_day: parseInt(e.target.value) || 5})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Merchant UPI ID</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" placeholder="merchant@upi" value={settings?.upi_id || ''} onChange={(e) => setSettings({...settings, upi_id: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">UPI Linked Mobile Phone Number</label>
                <input type="tel" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" placeholder="9876543210" value={settings?.upi_phone || ''} onChange={(e) => setSettings({...settings, upi_phone: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveSettings} disabled={isSubmitting} className="flex-1 bg-slate-800 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-slate-700 transition">{isSubmitting ? 'Saving...' : 'Save Configuration'}</button>
                <button onClick={() => setShowSettingsModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 7. MEMBERSHIP PAYWALL OVERLAY ==================== */}
      {showMembershipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMembershipModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-slate-800">✨ Premium Membership Plan</h2>
            <div className="space-y-3">
              <div className="w-full p-4 border rounded-xl text-left hover:bg-slate-50 transition cursor-pointer">
                <div className="font-bold text-slate-800">Monthly Tier Plan</div>
                <div className="text-sm text-slate-600">₹499 / Month</div>
              </div>
              <div className="w-full p-4 border-2 border-slate-800 rounded-xl text-left bg-slate-50/50 cursor-pointer">
                <div className="font-bold text-slate-800">Annual Professional Plan</div>
                <div className="text-sm text-slate-600">₹4,999 / Year</div>
              </div>
            </div>
            <button onClick={() => setShowMembershipModal(false)} className="w-full mt-4 py-2.5 text-sm font-medium text-gray-500 hover:text-slate-800 transition">Cancel</button>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}