"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Camera, Info, Navigation, Box, Map, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloorSelector from "@/components/FloorSelector"
import ScrollableMapContainer from "@/components/ScrollableMapContainer"
import { rooms, floors } from "@/lib/dummyData"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const FloorMap3D3F = dynamic(() => import("@/components/FloorMap3D3F"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading 3D View...</p>
      </div>
    </div>
  ),
})

/* ───── 2D Navigation Route Data ───── */
const CORRIDOR_Y = 550
const ELEVATOR_ID = "3f-1"

// Build a corridor route from elevator → destination using their actual pin
// coordinates so corners always land directly under the room pinpoints.
function buildRouteCorners(
  start: { x: number; y: number },
  dest: { x: number; y: number },
): { x: number; y: number }[] {
  return [
    { x: start.x, y: start.y },
    { x: start.x, y: CORRIDOR_Y },
    { x: dest.x, y: CORRIDOR_Y },
    { x: dest.x, y: dest.y },
  ]
}

function interpolateRoute(corners: { x: number; y: number }[], spacing = 100) {
  const result: { x: number; y: number }[] = [corners[0]]
  for (let i = 1; i < corners.length; i++) {
    const prev = corners[i - 1]
    const curr = corners[i]
    const dx = curr.x - prev.x
    const dy = curr.y - prev.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const steps = Math.max(0, Math.floor(dist / spacing) - 1)
    for (let s = 1; s <= steps; s++) {
      const t = s / (steps + 1)
      result.push({ x: Math.round(prev.x + dx * t), y: Math.round(prev.y + dy * t) })
    }
    result.push(curr)
  }
  return result
}

export default function ThirdFloorPage() {
  const router = useRouter()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [view, setView] = useState<"2d" | "3d">("2d")
  const [navTarget2D, setNavTarget2D] = useState<string | null>(null)

  const floorData = floors.find((f) => f.floorNumber === 2)
  const floorRooms = rooms.filter((r) => r.floor === "3rd Floor")
  const selectedRoomData = selectedRoom ? rooms.find((r) => r.id === selectedRoom) : null

  // Corners derived from elevator + destination pin coordinates so the route
  // always starts and ends exactly on the pinpoints.
  const activeRoute = useMemo(() => {
    if (!navTarget2D) return null
    const elevator = floorRooms.find((r) => r.id === ELEVATOR_ID)
    const dest = floorRooms.find((r) => r.id === navTarget2D)
    if (!elevator || !dest) return null
    const corners = buildRouteCorners(elevator.coordinates, dest.coordinates)
    return interpolateRoute(corners, 100)
  }, [navTarget2D, floorRooms])

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId)
    if (roomId !== "3f-1") {
      setNavTarget2D(roomId)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <style>{`
          @keyframes navDashFlow {
            to { stroke-dashoffset: -32; }
          }
          @keyframes navPulseRing {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.25; }
          }
          .nav-dash-animate {
            animation: navDashFlow 0.8s linear infinite;
          }
          .nav-pulse-circle {
            animation: navPulseRing 1.5s ease-in-out infinite;
          }
        `}</style>

        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">{floorData?.floorName} Map</h1>
            <p className="text-sm text-muted-foreground sm:text-base">{floorData?.description}</p>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <FloorSelector />

              {/* 2D / 3D Toggle */}
              <div className="flex items-center rounded-lg border bg-muted p-1 gap-1 w-fit">
                <button
                  onClick={() => setView("2d")}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    view === "2d"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Map className="h-4 w-4" />
                  2D Map
                </button>
                <button
                  onClick={() => setView("3d")}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    view === "3d"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Box className="h-4 w-4" />
                  3D View
                </button>
              </div>
            </div>

            <Button onClick={() => router.push("/ar")} className="gap-2 w-full sm:w-auto">
              <Camera className="h-4 w-4" />
              AR Navigation
            </Button>
          </div>

          {/* 3D Full View */}
          {view === "3d" ? (
            <div className="rounded-xl overflow-hidden border" style={{ height: "80vh" }}>
              <FloorMap3D3F />
            </div>
          ) : (
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="mb-3 sm:mb-4">
                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">Navigate to:</span>
                  </div>
                  <select
                    value={navTarget2D || ""}
                    onChange={(e) => setNavTarget2D(e.target.value || null)}
                    className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select destination...</option>
                    {floorRooms
                      .filter((r) => r.id !== "3f-1")
                      .map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.roomName}
                        </option>
                      ))}
                  </select>
                  {navTarget2D && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNavTarget2D(null)}
                      className="gap-1.5 whitespace-nowrap"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear
                    </Button>
                  )}
                </div>
              </Card>

              <Card className="overflow-hidden">
                <ScrollableMapContainer>
                  <div className="relative bg-muted">
                    <Image
                      src="/map/3rd-floor.png"
                      alt="Saint Benedict Hall Third Floor - Evacuation Plan"
                      width={1920}
                      height={1080}
                      className="block h-auto w-full"
                      priority
                    />

                    <svg
                      viewBox="0 0 1920 1080"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full pointer-events-none"
                      style={{ zIndex: 5 }}
                    >
                      <defs>
                        <marker
                          id="nav-arrow-mid-3f"
                          markerWidth="28"
                          markerHeight="18"
                          refX="14"
                          refY="9"
                          orient="auto"
                          markerUnits="userSpaceOnUse"
                        >
                          <path d="M0,1 L24,9 L0,17 L5,9 Z" fill="#f97316" opacity="0.85" />
                        </marker>
                        <marker
                          id="nav-arrow-end-3f"
                          markerWidth="34"
                          markerHeight="22"
                          refX="17"
                          refY="11"
                          orient="auto"
                          markerUnits="userSpaceOnUse"
                        >
                          <path d="M0,1 L30,11 L0,21 L7,11 Z" fill="#ea580c" />
                        </marker>
                        <filter id="nav-glow-3f" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {activeRoute && (
                        <>
                          <polyline
                            points={activeRoute.map((p) => `${p.x},${p.y}`).join(" ")}
                            fill="none"
                            stroke="rgba(249,115,22,0.2)"
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polyline
                            points={activeRoute.map((p) => `${p.x},${p.y}`).join(" ")}
                            fill="none"
                            stroke="rgba(249,115,22,0.35)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polyline
                            points={activeRoute.map((p) => `${p.x},${p.y}`).join(" ")}
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="20 12"
                            markerMid="url(#nav-arrow-mid-3f)"
                            className="nav-dash-animate"
                            filter="url(#nav-glow-3f)"
                          />
                          <circle
                            cx={activeRoute[0].x}
                            cy={activeRoute[0].y}
                            r="14"
                            fill="#22c55e"
                            stroke="white"
                            strokeWidth="3"
                          />
                          <text
                            x={activeRoute[0].x}
                            y={activeRoute[0].y - 24}
                            textAnchor="middle"
                            fill="#16a34a"
                            fontSize="20"
                            fontWeight="bold"
                            fontFamily="system-ui, sans-serif"
                          >
                            START
                          </text>
                          <circle
                            cx={activeRoute[activeRoute.length - 1].x}
                            cy={activeRoute[activeRoute.length - 1].y}
                            r="16"
                            fill="#ea580c"
                            stroke="white"
                            strokeWidth="3"
                          />
                          <circle
                            cx={activeRoute[activeRoute.length - 1].x}
                            cy={activeRoute[activeRoute.length - 1].y}
                            r="26"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="3"
                            className="nav-pulse-circle"
                          />
                        </>
                      )}
                    </svg>

                    {floorRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleRoomClick(room.id)}
                        aria-label={room.roomName}
                        title={room.roomName}
                        className={`group absolute flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95 ${
                          navTarget2D === room.id
                            ? "bg-orange-500 ring-2 ring-orange-300 ring-offset-2"
                            : room.id === "3f-1"
                              ? "bg-green-600"
                              : "bg-primary"
                        }`}
                        style={{
                          left: `${(room.coordinates.x / 1920) * 100}%`,
                          top: `${(room.coordinates.y / 1080) * 100}%`,
                          transform: "translate(-50%, -50%)",
                          zIndex: navTarget2D === room.id ? 15 : 10,
                        }}
                      >
                        <div
                          className={`h-2 w-2 sm:h-2.5 sm:w-2.5 animate-pulse rounded-full ${
                            navTarget2D === room.id ? "bg-white" : "bg-primary-foreground"
                          }`}
                        ></div>

                        <div className="pointer-events-none absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-card px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-card-foreground shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
                          {room.roomName}
                          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-card"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollableMapContainer>
              </Card>

              <Card className="mt-3 sm:mt-4">
                <div className="flex flex-wrap gap-3 p-3 sm:gap-5 sm:p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-primary flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-muted-foreground">Room Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-600 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-muted-foreground">Elevator (Start)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-orange-500 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-muted-foreground">Active Route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Tap markers for details</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:sticky lg:top-20 lg:self-start">
              <Card>
                <div className="p-4 sm:p-6">
                  <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-foreground">
                    {selectedRoomData ? "Room Details" : "Rooms on This Floor"}
                  </h3>

                  {selectedRoomData ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <div className="mb-2 text-lg sm:text-xl font-bold text-foreground">
                          {selectedRoomData.roomName}
                        </div>
                        <div className="mb-3 text-xs sm:text-sm text-muted-foreground">
                          {selectedRoomData.roomNumber}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{selectedRoomData.description}</p>
                      </div>

                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {selectedRoomData.category}
                        </Badge>
                        {selectedRoomData.capacity && (
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Capacity: {selectedRoomData.capacity} people
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-3 sm:pt-4">
                        <Button onClick={() => router.push(`/room/${selectedRoomData.id}`)} className="w-full text-sm">
                          View Full Details
                        </Button>
                        {selectedRoomData.id !== "3f-1" && (
                          <Button
                            onClick={() => setNavTarget2D(selectedRoomData.id)}
                            variant={navTarget2D === selectedRoomData.id ? "secondary" : "outline"}
                            className="w-full gap-2 text-sm"
                          >
                            <Navigation className="h-4 w-4" />
                            {navTarget2D === selectedRoomData.id ? "Navigating..." : "Navigate Here"}
                          </Button>
                        )}
                        <Button onClick={() => router.push("/ar")} variant="outline" className="w-full gap-2 text-sm">
                          <Camera className="h-4 w-4" />
                          Navigate with AR
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedRoom(null)
                            setNavTarget2D(null)
                          }}
                          variant="ghost"
                          className="w-full text-sm"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                        {floorRooms.length} rooms available on this floor
                      </div>
                      <div className="space-y-2 max-h-[300px] sm:max-h-none overflow-y-auto">
                        {floorRooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => handleRoomClick(room.id)}
                            className="w-full rounded-lg border p-2 sm:p-3 text-left transition-colors hover:bg-accent active:bg-accent"
                          >
                            <div className="font-medium text-foreground text-sm sm:text-base">{room.roomName}</div>
                            <div className="text-xs text-muted-foreground">{room.roomNumber}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
