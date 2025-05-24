"use client"

import { format } from "date-fns"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import { ActivityCard } from "./activity-card"
import { cn } from "../lib/utils"
import { useState } from "react"

type Activity = {
  id: number
  name: string
  description: string
  startTime: string
  endTime: string
  date: string
  tags: string[]
  genre: string
  color: string
}

interface ActivityDrawerProps {
  isOpen: boolean
  onClose: () => void
  activities: Activity[]
  selectedDate: Date
  position: "bottom" | "right"
}

export function ActivityDrawer({
  isOpen,
  onClose,
  activities,
  selectedDate,
  position = "bottom",
}: ActivityDrawerProps) {
  const [activeCardId, setActiveCardId] = useState<number | null>(null)

  const handleClose = () => {
    onClose()
  }

  const handleCardClick = (activityId: number) => {
    setActiveCardId(activeCardId === activityId ? null : activityId)
  }

  const isBottom = position === "bottom"

  // Convert time string to minutes from midnight
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Calculate position and height for each activity
  const getActivityStyle = (activity: Activity) => {
    const startMinutes = timeToMinutes(activity.startTime)
    const endMinutes = timeToMinutes(activity.endTime)
    const duration = endMinutes - startMinutes

    // Scale: 1 hour = 60px
    const pixelsPerMinute = 1
    const top = (startMinutes - 360) * pixelsPerMinute // Start from 6 AM (360 minutes)

    // For active cards, we don't constrain the height - it will be determined by content
    // For inactive cards, calculate based on duration with minimum of 40px
    const height =
      activeCardId === activity.id
        ? "auto" // Let the card determine its own height based on content
        : Math.max(duration * pixelsPerMinute, 40) // Minimum height of 40px

    // Higher z-index for active card
    const zIndex = activeCardId === activity.id ? 50 : 10

    return {
      top: Math.max(top, 0),
      height,
      zIndex,
    }
  }

  // Generate time labels for the timeline
  const generateTimeLabels = () => {
    const labels = []
    for (let hour = 6; hour <= 23; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`
      const position = (hour - 6) * 60 // 60px per hour
      labels.push({ time, position })
    }
    return labels
  }

  const timeLabels = generateTimeLabels()
  const sortedActivities = [...activities].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-50 transition-all duration-300 ease-in-out rounded-r-lg",
        isBottom ? (isOpen ? "bottom-0" : "-bottom-full") : isOpen ? "right-0" : "-right-full",
        isBottom ? "h-[70vh] md:h-[60vh]" : "top-0 h-full w-full max-w-md md:w-[400px]",
        !isOpen && "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-t-xl bg-white shadow-lg",
          isBottom ? "rounded-t-xl" : "rounded-l-xl",
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b bg-gray-50/50 p-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{format(selectedDate, "EEEE d, MMMM yyyy")}</h3>
            <p className="text-sm text-gray-500">
              {activities.length} {activities.length === 1 ? "activity" : "activities"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {/* Calendar timeline content */}
        <div className="flex-1 overflow-y-auto">
          {activities.length > 0 ? (
            <div className="relative">
              {/* Time labels and grid lines */}
              <div className="absolute left-0 top-0 h-full w-16">
                {timeLabels.map(({ time, position }) => (
                  <div
                    key={time}
                    className="absolute left-0 flex items-center text-xs font-medium text-gray-500"
                    style={{ top: position }}
                  >
                    <span className="w-12 pr-2 text-right">{time}</span>
                  </div>
                ))}
              </div>

              {/* Grid lines */}
              <div className="absolute left-16 top-0 right-0 h-full">
                {timeLabels.map(({ position }) => (
                  <div
                    key={position}
                    className="absolute left-0 right-0 border-t border-gray-100"
                    style={{ top: position }}
                  />
                ))}
              </div>

              {/* Activities */}
              <div className="relative ml-16 mr-4" style={{ height: `${18 * 60}px` }}>
                {sortedActivities.map((activity) => {
                  const style = getActivityStyle(activity)
                  const isActive = activeCardId === activity.id
                  return (
                    <div
                      key={activity.id}
                      className={cn("absolute left-2 right-0", isActive && "h-auto min-h-[160px]")}
                      style={{
                        top: `${style.top}px`,
                        height: isActive ? "auto" : `${style.height}px`,
                        minHeight: isActive ? "160px" : undefined,
                        zIndex: style.zIndex,
                      }}
                    >
                      <ActivityCard
                        activity={activity}
                        isTimelineView
                        isActive={isActive}
                        onClick={() => handleCardClick(activity.id)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Parece que puedes tomarte este día</p>
            </div>
          )}
        </div>

        {/* Drawer handle for mobile */}
        {isBottom && <div className="absolute left-1/2 top-3 h-1 w-16 -translate-x-1/2 rounded-full bg-gray-300" />}
      </div>
    </div>
  )
}
