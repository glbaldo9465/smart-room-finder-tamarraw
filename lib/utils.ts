import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Room } from "@/types/room"
import type { ClassSchedule } from "@/types/schedule"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function searchRooms(query: string, rooms: Room[], schedules?: ClassSchedule[]) {
  if (!query) return rooms

  const lowerQuery = query.toLowerCase()

  // Direct room matches (name, number, description, floor, faculty)
  const directMatches = rooms.filter(
    (room) =>
      room.roomName.toLowerCase().includes(lowerQuery) ||
      room.roomNumber.toLowerCase().includes(lowerQuery) ||
      room.description.toLowerCase().includes(lowerQuery) ||
      room.floor.toLowerCase().includes(lowerQuery) ||
      room.assignedFaculty?.toLowerCase().includes(lowerQuery),
  )

  if (directMatches.length > 0 || !schedules) return directMatches

  // If no direct room matches, search by subject name/code/section in schedules
  const matchingSchedules = schedules.filter(
    (s) =>
      s.subjectName.toLowerCase().includes(lowerQuery) ||
      s.subjectCode.toLowerCase().includes(lowerQuery) ||
      s.section.toLowerCase().includes(lowerQuery) ||
      s.facultyName.toLowerCase().includes(lowerQuery),
  )

  if (matchingSchedules.length === 0) return []

  const matchedRoomIds = [...new Set(matchingSchedules.map((s) => s.roomId))]
  return rooms.filter((room) => matchedRoomIds.includes(room.id))
}

export function getRoomsByFloor(floor: string, rooms: Room[]) {
  return rooms.filter((room) => room.floor === floor)
}

export function getSchedulesByRoom(roomId: string, schedules: ClassSchedule[]) {
  return schedules.filter((s) => s.roomId === roomId)
}

export function getTodaySchedule(roomId: string, schedules: ClassSchedule[]) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = days[new Date().getDay()]
  return schedules
    .filter((s) => s.roomId === roomId && s.dayOfWeek === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export function getCurrentClass(roomId: string, schedules: ClassSchedule[]) {
  const todaySchedule = getTodaySchedule(roomId, schedules)
  const now = new Date()
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  return todaySchedule.find((s) => currentTime >= s.startTime && currentTime <= s.endTime) || null
}

export function formatTime(time: string) {
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}
