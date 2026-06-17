import { formatCurrency, getSharingDetails } from '../lib/utils'

export default function RoomsTab({ rooms, getUpcomingVacateForRoom, getTenantsInRoom, roomMonthlyIncome, deleteRoom, isSubmitting, setSelectedRoom, setShowRoomDetailsModal }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        const sharing = getSharingDetails(room.sharing_type)
        const isFull = room.current_occupants >= room.capacity
        const availableSlots = room.capacity - room.current_occupants
        const roomTenants = getTenantsInRoom(room.id)
        const upcomingVacate = getUpcomingVacateForRoom(room.id)
        const allPaid = roomTenants.length > 0 && roomTenants.every(t => t.rent_status === 'paid')
        const monthlyCollected = roomMonthlyIncome[room.id] || 0
        return (
          <div
            key={room.id}
            onClick={() => { setSelectedRoom(room); setShowRoomDetailsModal(true) }}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden relative ${isFull ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-slate-50 to-gray-50'}`}
          >
            {upcomingVacate && (
              <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold ${upcomingVacate.daysLeft <= 3 ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-500 text-white'}`}>
                Ref: Vacates {upcomingVacate.daysLeft > 0 ? `in ${upcomingVacate.daysLeft} days` : 'overdue'}
              </div>
            )}
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Room {room.room_number}</h3>
                  <p className="text-sm text-gray-500 mt-1">{sharing.label} {sharing.icon}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isFull ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                    {isFull ? 'Full' : `${availableSlots} slot available`}
                  </div>
                  {roomTenants.length > 0 && (
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${allPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {allPaid ? 'All Paid' : 'Pending'}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(room.monthly_rent)}<span className="text-sm text-gray-400">/month</span></p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  This month: ₹{monthlyCollected.toLocaleString()}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Occupancy</span>
                  <span className="text-slate-600">{room.current_occupants}/{room.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full bg-gradient-to-r from-slate-600 to-slate-500" style={{ width: `${(room.current_occupants / room.capacity) * 100}%` }}></div>
                </div>
              </div>
              <div className="mt-3 pt-2 flex justify-end">
                <button onClick={(e) => { e.stopPropagation(); deleteRoom(room.id) }} disabled={isSubmitting} className="text-red-400 hover:text-red-600 text-xs disabled:opacity-50">
                  Delete Room
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}