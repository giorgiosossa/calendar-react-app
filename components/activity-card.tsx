"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"
import { cn } from "../lib/utils"

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

interface ActivityCardProps {
  activity: Activity
  isTimelineView?: boolean
  isActive?: boolean
  onClick?: () => void
}

export function ActivityCard({ activity, isTimelineView = false, isActive = false, onClick }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    if (isTimelineView && onClick) {
      onClick()
    } else {
      setExpanded(!expanded)
    }
  }

  // Generate a contrasting text color based on tag name
  const getTagColor = (tag: string) => {
    const colors = {
      Work: "bg-rose-100 text-rose-800",
      Deadline: "bg-red-100 text-red-800",
      Education: "bg-blue-100 text-blue-800",
      Design: "bg-indigo-100 text-indigo-800",
      Sports: "bg-emerald-100 text-emerald-800",
      Health: "bg-green-100 text-green-800",
      Social: "bg-purple-100 text-purple-800",
      Food: "bg-amber-100 text-amber-800",
      Meeting: "bg-sky-100 text-sky-800",
      Personal: "bg-violet-100 text-violet-800",
    }

    return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  // Get background color based on activity color
  const getBackgroundColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "bg-blue-500": "bg-blue-50 border-blue-200",
      "bg-green-500": "bg-green-50 border-green-200",
      "bg-purple-500": "bg-purple-50 border-purple-200",
      "bg-red-500": "bg-red-50 border-red-200",
      "bg-yellow-500": "bg-yellow-50 border-yellow-200",
      "bg-indigo-500": "bg-indigo-50 border-indigo-200",
      "bg-pink-500": "bg-pink-50 border-pink-200",
      "bg-teal-500": "bg-teal-50 border-teal-200",
      "bg-orange-500": "bg-orange-50 border-orange-200",
      "bg-cyan-500": "bg-cyan-50 border-cyan-200",
      "bg-lime-500": "bg-lime-50 border-lime-200",
      "bg-emerald-500": "bg-emerald-50 border-emerald-200",
      "bg-violet-500": "bg-violet-50 border-violet-200",
      "bg-fuchsia-500": "bg-fuchsia-50 border-fuchsia-200",
      "bg-rose-500": "bg-rose-50 border-rose-200",
      "bg-sky-500": "bg-sky-50 border-sky-200",
    }
    return colorMap[color] || "bg-gray-50 border-gray-200"
  }

  // Get active background color (more saturated) for clicked cards
  const getActiveBackgroundColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "bg-blue-500": "bg-blue-100 border-blue-300",
      "bg-green-500": "bg-green-100 border-green-300",
      "bg-purple-500": "bg-purple-100 border-purple-300",
      "bg-red-500": "bg-red-100 border-red-300",
      "bg-yellow-500": "bg-yellow-100 border-yellow-300",
      "bg-indigo-500": "bg-indigo-100 border-indigo-300",
      "bg-pink-500": "bg-pink-100 border-pink-300",
      "bg-teal-500": "bg-teal-100 border-teal-300",
      "bg-orange-500": "bg-orange-100 border-orange-300",
      "bg-cyan-500": "bg-cyan-100 border-cyan-300",
      "bg-lime-500": "bg-lime-100 border-lime-300",
      "bg-emerald-500": "bg-emerald-100 border-emerald-300",
      "bg-violet-500": "bg-violet-100 border-violet-300",
      "bg-fuchsia-500": "bg-fuchsia-100 border-fuchsia-300",
      "bg-rose-500": "bg-rose-100 border-rose-300",
      "bg-sky-500": "bg-sky-100 border-sky-300",
    }
    return colorMap[color] || "bg-gray-100 border-gray-300"
  }

  if (isTimelineView) {
    return (
      <div
        className={cn(
          "h-full cursor-pointer overflow-hidden rounded-2xl border-l-4 transition-all duration-200 hover:shadow-md",
          isActive ? getActiveBackgroundColor(activity.color) : getBackgroundColor(activity.color),
          isActive ? "shadow-lg scale-105" : "shadow-sm",
          "border-2",
          isActive && "h-auto",
        )}
        onClick={toggleExpanded}
      >
        <div className={cn("absolute left-0 top-2 h-4 w-1 rounded-full", activity.color)} />

        <div className={cn("flex flex-col p-3", isActive ? "h-auto" : "h-full")}>
          <div className={cn("min-h-0", isActive ? "" : "flex-1")}>
            <h4 className="mb-1 truncate text-sm font-semibold leading-tight text-gray-900">{activity.name}</h4>
            {!isActive && (
              <div className="flex items-center text-xs text-gray-600">
                <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {activity.startTime} - {activity.endTime}
                </span>
              </div>
            )}
          </div>

          {isActive && (
            <div className="mt-2 space-y-2 border-t border-white/50 pt-2">
              <div className="flex items-center text-xs text-gray-600">
                <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                <span>
                  {activity.startTime} - {activity.endTime}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-gray-700">{activity.description}</p>

              <div className="text-xs">
                <span className="font-medium text-gray-600">Genre:</span>
                <span className="ml-1 text-gray-700">{activity.genre}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      getTagColor(tag),
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-1 flex justify-center">
            <button className="text-gray-400 transition-colors hover:text-gray-600">
              {isActive ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Original card design for non-timeline view
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-all duration-300",
        getBackgroundColor(activity.color),
        expanded ? "shadow-md" : "shadow-sm",
      )}
    >
      <div className="flex cursor-pointer items-center justify-between p-4" onClick={toggleExpanded}>
        <div className="flex items-center gap-3">
          <div className={cn("h-4 w-4 rounded-full", activity.color)} />
          <div>
            <h4 className="font-medium text-gray-900">{activity.name}</h4>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>
                {activity.startTime} - {activity.endTime}
              </span>
            </div>
          </div>
        </div>

        <button className="text-gray-500 hover:text-gray-700">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {expanded && (
        <div className="rounded-b-2xl border-t bg-white/50 p-4">
          <div className="mb-3">
            <p className="text-sm text-gray-700">{activity.description}</p>
          </div>

          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500">Genre:</span>
            <span className="ml-2 text-sm text-gray-700">{activity.genre}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  getTagColor(tag),
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
