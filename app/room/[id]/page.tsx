"use client"

import { useParams } from "next/navigation"
import { MapPin, Users, Clock, Navigation, MapIcon, ArrowLeft, User, CalendarDays, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { rooms, schedules } from "@/lib/dummyData"
import { getSchedulesByRoom, getTodaySchedule, getCurrentClass, formatTime } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const

export default function RoomDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const room = rooms.find((r) => r.id === id)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  if (!room) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Room Not Found</h1>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const roomSchedules = getSchedulesByRoom(room.id, schedules)
  const todaySchedule = getTodaySchedule(room.id, schedules)
  const currentClass = getCurrentClass(room.id, schedules)

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const todayName = days[new Date().getDay()]

  const displayDay = selectedDay || todayName
  const displaySchedule = selectedDay
    ? roomSchedules
        .filter((s) => s.dayOfWeek === selectedDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    : todaySchedule

  const getFloorPath = (floor: string) => {
    switch (floor) {
      case "Ground Floor":
        return "/map/ground-floor"
      case "2nd Floor":
        return "/map/second-floor"
      case "3rd Floor":
        return "/map/third-floor"
      default:
        return "/map/ground-floor"
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-foreground">{room.roomName}</h1>
                <p className="text-xl text-muted-foreground">{room.roomNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                {currentClass && (
                  <Badge variant="destructive" className="text-sm">
                    In Use
                  </Badge>
                )}
                <Badge variant={room.isAvailable ? "default" : "secondary"} className="text-base">
                  {room.isAvailable ? "Available" : "Restricted"}
                </Badge>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">{room.description}</p>
          </div>

          {/* Current Class Banner */}
          {currentClass && (
            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">Currently Ongoing</div>
                  <div className="text-sm text-muted-foreground">
                    {currentClass.subjectCode} - {currentClass.subjectName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentClass.facultyName} | {currentClass.section} | {formatTime(currentClass.startTime)} - {formatTime(currentClass.endTime)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Info Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Room Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="mb-1 font-semibold text-foreground">Location</div>
                    <div className="text-muted-foreground">{room.floor}</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Coordinates: X: {room.coordinates.x}, Y: {room.coordinates.y}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="mb-1 font-semibold text-foreground">Category</div>
                    <div className="text-muted-foreground">{room.category}</div>
                  </div>
                </div>

                {/* Assigned Faculty */}
                {room.assignedFaculty && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-foreground">Assigned Faculty</div>
                      <div className="text-muted-foreground">{room.assignedFaculty}</div>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {room.capacity && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-foreground">Capacity</div>
                      <div className="text-muted-foreground">{room.capacity} people</div>
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <div className="mb-3 font-semibold text-foreground">Amenities</div>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Navigation Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigate to Room</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={getFloorPath(room.floor)}>
                    <Button className="w-full gap-2" size="lg">
                      <MapIcon className="h-5 w-5" />
                      View on Map
                    </Button>
                  </Link>
                  <Link href="/ar">
                    <Button variant="outline" className="w-full gap-2 bg-transparent" size="lg">
                      <Navigation className="h-5 w-5" />
                      AR Navigation
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Floor:</span>
                    <span className="font-medium text-foreground">{room.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Number:</span>
                    <span className="font-medium text-foreground">{room.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium text-foreground">{room.category}</span>
                  </div>
                  {room.assignedFaculty && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Faculty:</span>
                      <span className="font-medium text-foreground">{room.assignedFaculty}</span>
                    </div>
                  )}
                  {room.capacity && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium text-foreground">{room.capacity}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Class Schedule Section */}
          {roomSchedules.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Class Schedule
                  </CardTitle>
                  {!selectedDay && todayName !== "Sunday" && (
                    <Badge variant="outline">{todayName}</Badge>
                  )}
                </div>
                {/* Day Selector */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant={selectedDay === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay(null)}
                  >
                    Today
                  </Button>
                  {DAYS.map((day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDay(day)}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {displaySchedule.length > 0 ? (
                  <div className="space-y-3">
                    {displaySchedule.map((sched) => (
                      <div
                        key={sched.id}
                        className={`flex items-center gap-4 rounded-lg border p-4 ${
                          currentClass?.id === sched.id
                            ? "border-primary/30 bg-primary/5"
                            : ""
                        }`}
                      >
                        <div className="min-w-[100px] text-center">
                          <div className="text-sm font-semibold text-foreground">
                            {formatTime(sched.startTime)}
                          </div>
                          <div className="text-xs text-muted-foreground">to</div>
                          <div className="text-sm font-semibold text-foreground">
                            {formatTime(sched.endTime)}
                          </div>
                        </div>
                        <div className="h-12 w-px bg-border" />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {sched.subjectCode} - {sched.subjectName}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {sched.facultyName}
                            </span>
                            <span>|</span>
                            <span>{sched.section}</span>
                          </div>
                        </div>
                        {currentClass?.id === sched.id && (
                          <Badge variant="destructive" className="flex-shrink-0">
                            Now
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <CalendarDays className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>No classes scheduled for {displayDay}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Floor Map Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Floor Layout Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <MapIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Click "View on Map" to see the exact location</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
