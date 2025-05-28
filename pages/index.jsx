"use client"

import { useState, useEffect, useRef } from "react"
import { CalendarView } from "../components/calendar-view"
import { ActivityDrawer } from "../components/activity-drawer"
import { Button } from "../components/ui/button"
import { Plus, Calendar } from "lucide-react"
import { CreateActivityDialog } from "../components/create-activity-dialog"
import { useMediaQuery } from "../hooks/use-media-query"
import WelcomeCard from "../components/welcome-card"

// Sample user data
const userData = {
  name: "Jorge",
  activities: [
    {
      id: 1,
      name: "Assignment Deadline",
      description: "Final submission for the UX research project",
      startTime: "08:00",
      endTime: "10:00",
      date: "2025-05-14",
      tags: ["Work", "Deadline"],
      genre: "Academic",
      color: "bg-rose-500",
    },
    {
      id: 2,
      name: "History of UX design",
      description: "Lecture on the evolution of user experience design principles",
      startTime: "12:00",
      endTime: "13:30",
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
  const [scrollY, setScrollY] = useState(0)
  const [isStacked, setIsStacked] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1099px)")
  const isDesktop = useMediaQuery("(min-width: 1100px)")

  const summaryCardRef = useRef(null)
  const calendarCardRef = useRef(null)
  const activitiesCardRef = useRef(null)
  
  const handleClaraToggle = (enabled) => {
    console.log('CLARA está:', enabled ? 'activada' : 'desactivada')
  }

  // Format the selected date to match the activity date format for filtering
  const formattedSelectedDate = selectedDate.toISOString().split("T")[0]

  // Filter activities for the selected date
  const selectedDateActivities = userData.activities.filter((activity) => activity.date === formattedSelectedDate)

  // Get today's activities count
  const todayActivities = userData.activities.filter((activity) => {
    const today = new Date().toISOString().split("T")[0]
    return activity.date === today
  })

  // Scroll effect for mobile card stacking
  useEffect(() => {
    if (isDesktop) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Threshold for when to start stacking (adjust as needed)
      const stackThreshold = 100

      if (currentScrollY > stackThreshold && !isStacked) {
        setIsStacked(true)
      } else if (currentScrollY <= stackThreshold && isStacked) {
        setIsStacked(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDesktop, isStacked])

  // Calculate transform values for stacking effect
  const getCardTransform = (cardIndex) => {
    if (isDesktop || !isStacked) return {}

    const baseOffset = 20 // Base offset for stacking
    const scaleReduction = 0.05 // How much to scale down each card

    return {
      transform: `translateY(-${cardIndex * baseOffset}px) scale(${1 - cardIndex * scaleReduction})`,
      zIndex: cardIndex + 1, // First card (index 0) = z-index 1, last card (index 2) = z-index 3
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  }

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

  const handleCreateActivity = () => {
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-white pb-2 overflow-hidden">
      {/* Desktop Static ActivityDrawer - Left Side */}
      {isDesktop && (
        <ActivityDrawer
          isOpen={true}
          onClose={() => {}} // No se usa en modo estático
          activities={selectedDateActivities}
          selectedDate={selectedDate}
          position="left"
          isStatic={true}
          onCreateActivity={handleCreateActivity}
        />
      )}

      {/* Main Content */}
      <div className="pb-2">
        {/* Content Grid */}
        <div className="max-w-full mx-auto px-3 py-1">
          <div className={`${isDesktop ? "grid grid-cols-12 gap-6 h-screen pl-96" : "space-y-4"}`}>
            {/* Main Content - Left Side */}
            <div className={`${isDesktop ? "col-span-9" : "w-full"} space-y-4`}>
              <main className="">
                <WelcomeCard onClaraToggle={handleClaraToggle}  />
              </main>

              {/* Today's Summary Card */}
              <div
                ref={summaryCardRef}
                className="bg-[#ae8276] rounded-2xl p-4 shadow-md relative"
                style={!isDesktop ? getCardTransform(0) : {}}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-semibold text-white">CLARA ha agendado</h3>
                      <p className="text-sm text-white">{todayActivities.length} actividades</p>
                    </div>
                  </div>
                  {!isDesktop && (
                    <Button
                      size="sm"
                      className="bg-[#272624] hover:bg-[#272624] text-white rounded-full px-4"
                      onClick={handleViewActivities}
                    >
                      Ver
                    </Button>
                  )}
                </div>
              </div>

              {/* Calendar Card */}
              <div
                ref={calendarCardRef}
                className="bg-[#899387] rounded-3xl p-4 shadow-sm relative"
                style={!isDesktop ? getCardTransform(1) : {}}
              >
                <CalendarView
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  activities={userData.activities}
                />
                <div className="mt-4">
                  <Button
                    onClick={handleCreateActivity}
                    className="w-full bg-[#343b34] hover:bg-black text-white rounded-2xl h-12 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Crear Evento</span>
                  </Button>
                </div>
              </div>

              {/* Activities Preview Card - Mobile/Tablet Only */}
              {!isDesktop && selectedDateActivities.length > 0 && (
                <div
                  ref={activitiesCardRef}
                  className="bg-[#d7d4d5] rounded-3xl p-6 shadow-sm border border-gray-100 relative"
                  style={getCardTransform(2)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[261f0f]">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <span className="text-sm text-[261f0f]">{selectedDateActivities.length} eventos</span>
                  </div>

                  <div className="space-y-3">
                    {selectedDateActivities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-0 bg-[#d7d4d5] rounded-2xl">
                        <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[261f0f] truncate">{activity.name}</p>
                          <p className="text-sm text-[261f0f]">
                            {activity.startTime} - {activity.endTime}
                          </p>
                        </div>
                      </div>
                    ))}

                    {selectedDateActivities.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full text-[261f0f] hover:bg-blue-50 rounded-2xl"
                        onClick={handleViewActivities}
                      >
                        Ver {selectedDateActivities.length - 3} eventos más
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Center Column - Quick Actions */}
            {isDesktop && (
              <div className="col-span-3 space-y-4 mt-2">
                <div className="bg-[#899387] rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-200 mb-4">Atajos</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleCreateActivity}
                      className="w-full bg-[#343b34] hover:bg-black text-white rounded-2xl h-12"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Nuevo Evento
                    </Button>
                  </div>
                </div>

                {/* Selected Date Summary */}
                {selectedDateActivities.length > 0 && (
                  <div className="bg-[#c9b096] rounded-3xl p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-100 text-sm">
                        {selectedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </h3>
                      <p className="text-xs text-gray-100">{selectedDateActivities.length} eventos</p>
                    </div>
                  </div>
                )}
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
          isStatic={false}
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