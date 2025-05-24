"use client"

import { useState } from "react"
import { CalendarView } from "../components/calendar-view"
import { ActivityDrawer } from "../components/activity-drawer"
import { Button } from "../components/ui/button"
import { Plus, Calendar, Clock, Home, Settings, User } from "lucide-react"
import { CreateActivityDialog } from "../components/create-activity-dialog"
import { useMediaQuery } from "../hooks/use-media-query"

// Sample user data
const userData = {
  name: "Jorge",
  activities: [
    {
      id: 1,
      name: "Assignment Deadline",
      description: "Final submission for the UX research project",
      startTime: "08:00",
      endTime: "17:00",
      date: "2025-05-14",
      tags: ["Work", "Deadline"],
      genre: "Academic",
      color: "bg-rose-500",
    },
    {
      id: 2,
      name: "History of UX design",
      description: "Lecture on the evolution of user experience design principles",
      startTime: "17:00",
      endTime: "19:30",
      date: "2025-05-14",
      tags: ["Education", "Design"],
      genre: "Academic",
      color: "bg-sky-500",
    },
    {
      id: 3,
      name: "Class Cancelled",
      description: "Marketing basics class cancelled due to instructor illness",
      startTime: "17:00",
      endTime: "19:30",
      date: "2025-05-14",
      tags: ["Education"],
      genre: "Academic",
      color: "bg-amber-500",
    },
    {
      id: 4,
      name: "Basketball Training",
      description: "Weekly team practice and conditioning",
      startTime: "19:00",
      endTime: "21:00",
      date: "2025-05-14",
      tags: ["Sports", "Health"],
      genre: "Recreation",
      color: "bg-emerald-500",
    },
    {
      id: 5,
      name: "Dinner with Diana",
      description: "Catching up at the new Italian restaurant downtown",
      startTime: "22:00",
      endTime: "23:30",
      date: "2025-05-14",
      tags: ["Social", "Food"],
      genre: "Personal",
      color: "bg-violet-500",
    },
  ],
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1099px)")
  const isDesktop = useMediaQuery("(min-width: 1100px)")

  // Format the selected date to match the activity date format for filtering
  const formattedSelectedDate = selectedDate.toISOString().split("T")[0]

  // Filter activities for the selected date
  const selectedDateActivities = userData.activities.filter((activity) => activity.date === formattedSelectedDate)

  // Get today's activities count
  const todayActivities = userData.activities.filter((activity) => {
    const today = new Date().toISOString().split("T")[0]
    return activity.date === today
  })

  // Handle viewing activities - different behavior for mobile/tablet vs desktop
  const handleViewActivities = () => {
    if (!isDesktop) {
      setIsDrawerOpen(true)
    }
    // En desktop no hacer nada ya que el drawer siempre está visible
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    // Don't auto-open drawer on date selection
  }

  return (
    <div className="min-h-screen bg-white pb-20 overflow-hidden">
      {/* Main Content */}
      <div className="pb-4">
        {/* Content Grid */}
        <div className="max-w-full mx-auto px-4 py-6">
          <div className={`${isDesktop ? "grid grid-cols-12 gap-6 h-screen pl-96" : "space-y-4"}`}>
            {/* Main Content - Left Side */}
            <div className={`${isDesktop ? "col-span-9" : "w-full"} space-y-4`}>
              {/* Welcome Card */}
              <div className="bg-white rounded-3xl p-6 ">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold text-gray-900 leading-tight`}>
                      Buen día
                      <br />
                      {userData.name}!
                    </h1>
                  </div>
                </div>
              </div>

              {/* Today's Summary Card */}
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Actividades para hoy</h3>
                      <p className="text-sm text-gray-500">{todayActivities.length} actividades planeadas</p>
                    </div>
                  </div>
                  {!isDesktop && (
                    <Button
                      size="sm"
                      className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-4"
                      onClick={handleViewActivities}
                    >
                      View
                    </Button>
                  )}
                </div>
              </div>

              {/* Calendar Card */}
              <div className="bg-blue-700 rounded-3xl p-4 shadow-sm">
                <CalendarView
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  activities={userData.activities}
                />
                <div className="mt-4">
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-800 text-white rounded-2xl h-12 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create New Event</span>
                  </Button>
                </div>
              </div>

              {/* Activities Preview Card - Mobile/Tablet Only */}
              {!isDesktop && selectedDateActivities.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <span className="text-sm text-gray-500">{selectedDateActivities.length} events</span>
                  </div>

                  <div className="space-y-3">
                    {selectedDateActivities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                        <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{activity.name}</p>
                          <p className="text-sm text-gray-500">
                            {activity.startTime} - {activity.endTime}
                          </p>
                        </div>
                      </div>
                    ))}

                    {selectedDateActivities.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full text-blue-600 hover:bg-blue-50 rounded-2xl"
                        onClick={handleViewActivities}
                      >
                        View {selectedDateActivities.length - 3} more events
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Center Column - Quick Actions */}
            {isDesktop && (
              <div className="col-span-3 space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Atajos</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Nuevo Evento
                    </Button>
                  </div>
                </div>

                {/* Selected Date Summary */}
                {selectedDateActivities.length > 0 && (
                  <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {selectedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </h3>
                      <p className="text-xs text-gray-500">{selectedDateActivities.length} events</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Desktop Left Column - Activities Drawer (Fixed) */}
            {isDesktop && (
              <div className="fixed left-4 top-4 w-80 h-[97vh] z-10">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 h-full overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Activities
                      </h3>
                      <span className="text-sm text-gray-500">{selectedDateActivities.length} events</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  
                  <div className="h-full overflow-hidden">
                    {selectedDateActivities.length > 0 ? (
                      <div className="h-full overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {selectedDateActivities.map((activity) => (
                          <div key={activity.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-start space-x-3">
                              <div className={`w-5 h-5 rounded-full ${activity.color} mt-1 flex-shrink-0 shadow-sm`}></div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-2 text-base">{activity.name}</h4>
                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{activity.description}</p>
                                <div className="flex items-center justify-between text-sm mb-3">
                                  <span className="font-medium text-blue-600">{activity.startTime} - {activity.endTime}</span>
                                  <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">{activity.genre}</span>
                                </div>
                                {activity.tags && activity.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {activity.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-medium shadow-sm"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Spacer para asegurar scroll */}
                        <div className="h-4"></div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-6">
                        <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="font-medium text-gray-700 mb-2">No events scheduled</h4>
                        <p className="text-gray-500 text-center text-sm mb-4">Create your first event for this date</p>
                        <Button
                          onClick={() => setIsCreateDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Event
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Drawer - Solo para Mobile/Tablet */}
      {!isDesktop && (
        <ActivityDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activities={selectedDateActivities}
          selectedDate={selectedDate}
          position="bottom"
        />
      )}

      {/* Create Activity Dialog */}
      <CreateActivityDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  )
}