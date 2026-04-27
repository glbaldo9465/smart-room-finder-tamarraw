"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowLeft, Camera, MapPin, Navigation, ChevronRight, X, Compass, Info, Printer, Clock, Route, ArrowUp, CornerUpLeft, CornerUpRight, Flag, CircleDot, Check } from "lucide-react"
import { rooms } from "@/lib/dummyData"

const CATEGORY_ICONS: Record<string, string> = {
  "Education and Training": "🏫",
  Classroom: "🏫",
  Office: "🏢",
  "Stock Room": "📦",
  Facilities: "🚻",
  Navigation: "🚀",
  "Conference Room": "🤝",
  "Faculty Room": "👩‍🏫",
  Library: "📚",
  Clinic: "🏥",
  IT: "💻",
  Pantry: "🍽️",
  Printing: "🖨️",
}

const CATEGORY_COLORS: Record<string, string> = {
  "Education and Training": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Classroom: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Office: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Stock Room": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Facilities: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Navigation: "bg-red-500/10 text-red-400 border-red-500/20",
  "Conference Room": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Faculty Room": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Library: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Clinic: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  IT: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Pantry: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Printing: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
}

/* ───── Floor Config ───── */
const FLOOR_CONFIG: Record<string, { label: string; mapImage: string; elevatorId: string }> = {
  ground: { label: "Ground Floor", mapImage: "/map/ground-floor.jpg", elevatorId: "9" },
  second: { label: "2nd Floor", mapImage: "/map/2nd-floor.png", elevatorId: "2f-1" },
  third: { label: "3rd Floor", mapImage: "/map/3rd-floor.png", elevatorId: "3f-1" },
  fourth: { label: "4th Floor", mapImage: "/map/4rth-floor.png", elevatorId: "4f-1" },
  fifth: { label: "5th Floor", mapImage: "/map/5th-floor.png", elevatorId: "5f-1" },
}

/* ───── Route Data ───── */
const GF_CORRIDOR_Y = 390
const SF_CORRIDOR_Y = 480
const TF_CORRIDOR_Y = 550
const FF_CORRIDOR_Y = 550
const FIF_CORRIDOR_Y = 550

const ROUTE_CORNERS: Record<string, { x: number; y: number }[]> = {
  "1": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 360, y: GF_CORRIDOR_Y },
    { x: 360, y: 600 },
  ],
  "2": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 620, y: GF_CORRIDOR_Y },
    { x: 620, y: 600 },
  ],
  "3": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 870, y: GF_CORRIDOR_Y },
    { x: 870, y: 600 },
  ],
  "4": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 848, y: GF_CORRIDOR_Y },
    { x: 848, y: 225 },
  ],
  "5": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 1050, y: GF_CORRIDOR_Y },
    { x: 1050, y: 225 },
  ],
  "6": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 1200, y: GF_CORRIDOR_Y },
    { x: 1200, y: 600 },
  ],
  "7": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 1700, y: GF_CORRIDOR_Y },
    { x: 1700, y: 600 },
  ],
  "8": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 1150, y: GF_CORRIDOR_Y },
    { x: 1150, y: 225 },
  ],
  "10": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 1800, y: GF_CORRIDOR_Y },
    { x: 1800, y: 225 },
  ],
  "11": [
    { x: 190, y: 225 },
    { x: 190, y: GF_CORRIDOR_Y },
    { x: 1600, y: GF_CORRIDOR_Y },
    { x: 1600, y: 225 },
  ],
  // ── 2nd Floor Routes ──
  "2f-2": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 70, y: SF_CORRIDOR_Y }, { x: 70, y: 740 }],
  "2f-3": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 200, y: SF_CORRIDOR_Y }, { x: 200, y: 790 }],
  "2f-4": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 300, y: SF_CORRIDOR_Y }, { x: 300, y: 720 }],
  "2f-5": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 440, y: SF_CORRIDOR_Y }, { x: 440, y: 710 }],
  "2f-6": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 390, y: SF_CORRIDOR_Y }, { x: 390, y: 800 }],
  "2f-7": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 820, y: SF_CORRIDOR_Y }, { x: 820, y: 600 }],
  "2f-8": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 1250, y: SF_CORRIDOR_Y }, { x: 1250, y: 600 }],
  "2f-9": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 1400, y: SF_CORRIDOR_Y }, { x: 1400, y: 600 }],
  "2f-10": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 1400, y: SF_CORRIDOR_Y }, { x: 1400, y: 730 }],
  "2f-11": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 1550, y: SF_CORRIDOR_Y }, { x: 1550, y: 750 }],
  "2f-12": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 1579, y: SF_CORRIDOR_Y }, { x: 1579, y: 614 }],
  "2f-13": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 1700, y: SF_CORRIDOR_Y }, { x: 1700, y: 450 }],
  "2f-14": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 1500, y: SF_CORRIDOR_Y }, { x: 1500, y: 317 }],
  "2f-15": [{ x: 190, y: 420 }, { x: 190, y: SF_CORRIDOR_Y }, { x: 1500, y: SF_CORRIDOR_Y }, { x: 1500, y: 427 }],
  // ── 3rd Floor Routes ──
  "3f-2": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 150, y: TF_CORRIDOR_Y }, { x: 150, y: 740 }],
  "3f-3": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 420, y: TF_CORRIDOR_Y }, { x: 420, y: 690 }],
  "3f-4": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 700, y: TF_CORRIDOR_Y }, { x: 700, y: 690 }],
  "3f-5": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 950, y: TF_CORRIDOR_Y }, { x: 950, y: 690 }],
  "3f-6": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 1100, y: TF_CORRIDOR_Y }, { x: 1100, y: 690 }],
  "3f-7": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 1270, y: TF_CORRIDOR_Y }, { x: 1270, y: 690 }],
  "3f-8": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 1450, y: TF_CORRIDOR_Y }, { x: 1450, y: 690 }],
  "3f-9": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 1570, y: TF_CORRIDOR_Y }, { x: 1570, y: 690 }],
  "3f-10": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 1800, y: TF_CORRIDOR_Y }, { x: 1800, y: 690 }],
  "3f-11": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 1750, y: TF_CORRIDOR_Y }, { x: 1750, y: 400 }],
  "3f-12": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 1500, y: TF_CORRIDOR_Y }, { x: 1500, y: 317 }],
  "3f-13": [{ x: 230, y: 400 }, { x: 230, y: TF_CORRIDOR_Y }, { x: 1500, y: TF_CORRIDOR_Y }, { x: 1500, y: 427 }],
  // ── 4th Floor Routes ──
  "4f-2": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 120, y: FF_CORRIDOR_Y }, { x: 120, y: 740 }],
  "4f-3": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 350, y: FF_CORRIDOR_Y }, { x: 350, y: 740 }],
  "4f-4": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 570, y: FF_CORRIDOR_Y }, { x: 570, y: 740 }],
  "4f-5": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 800, y: FF_CORRIDOR_Y }, { x: 800, y: 740 }],
  "4f-6": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 1050, y: FF_CORRIDOR_Y }, { x: 1050, y: 740 }],
  "4f-7": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 1250, y: FF_CORRIDOR_Y }, { x: 1250, y: 740 }],
  "4f-8": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 1430, y: FF_CORRIDOR_Y }, { x: 1430, y: 740 }],
  "4f-9": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 1630, y: FF_CORRIDOR_Y }, { x: 1630, y: 740 }],
  "4f-10": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 1830, y: FF_CORRIDOR_Y }, { x: 1830, y: 740 }],
  "4f-11": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 1700, y: FF_CORRIDOR_Y }, { x: 1700, y: 500 }],
  "4f-12": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 1500, y: FF_CORRIDOR_Y }, { x: 1500, y: 317 }],
  "4f-13": [{ x: 180, y: 420 }, { x: 180, y: FF_CORRIDOR_Y }, { x: 1500, y: FF_CORRIDOR_Y }, { x: 1500, y: 427 }],
  // ── 5th Floor Routes ──
  "5f-2": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 150, y: FIF_CORRIDOR_Y }, { x: 150, y: 740 }],
  "5f-3": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 360, y: FIF_CORRIDOR_Y }, { x: 360, y: 740 }],
  "5f-4": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 600, y: FIF_CORRIDOR_Y }, { x: 600, y: 740 }],
  "5f-5": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 820, y: FIF_CORRIDOR_Y }, { x: 820, y: 740 }],
  "5f-6": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 1050, y: FIF_CORRIDOR_Y }, { x: 1050, y: 740 }],
  "5f-7": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 1250, y: FIF_CORRIDOR_Y }, { x: 1250, y: 740 }],
  "5f-8": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 1400, y: FIF_CORRIDOR_Y }, { x: 1400, y: 740 }],
  "5f-9": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 1550, y: FIF_CORRIDOR_Y }, { x: 1550, y: 740 }],
  "5f-10": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 1750, y: FIF_CORRIDOR_Y }, { x: 1750, y: 740 }],
  "5f-11": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 1750, y: FIF_CORRIDOR_Y }, { x: 1750, y: 400 }],
  "5f-12": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 1500, y: FIF_CORRIDOR_Y }, { x: 1500, y: 317 }],
  "5f-13": [{ x: 190, y: 420 }, { x: 190, y: FIF_CORRIDOR_Y }, { x: 1500, y: FIF_CORRIDOR_Y }, { x: 1500, y: 427 }],
}

/** Pixel→meter scale: ~1450px building ≈ 80m → 1px ≈ 0.055m */
const PX_TO_M = 0.055

type StepKind = "start" | "forward" | "left" | "right" | "arrive"
type RouteStep = { kind: StepKind; text: string; meters?: number }

/** Convert waypoints into a turn-by-turn step list.
 *  Image coords: x→right, y→down. Cross product of consecutive segment
 *  vectors determines left vs right turn (cross > 0 ⇒ right turn). */
function buildSteps(waypoints: { x: number; y: number }[], destinationName: string): RouteStep[] {
  if (!waypoints || waypoints.length < 2) return []
  const steps: RouteStep[] = [{ kind: "start", text: "Start at the Elevator" }]

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i]
    const b = waypoints[i + 1]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const meters = Math.max(1, Math.round(Math.hypot(dx, dy) * PX_TO_M))
    steps.push({ kind: "forward", text: `Walk ${meters}m forward`, meters })

    // Turn instruction at corner b (skip if b is the final destination)
    if (i < waypoints.length - 2) {
      const c = waypoints[i + 2]
      const cross = dx * (c.y - b.y) - dy * (c.x - b.x)
      if (Math.abs(cross) > 1e-6) {
        steps.push({ kind: cross > 0 ? "right" : "left", text: cross > 0 ? "Turn right" : "Turn left" })
      }
    }
  }

  steps.push({ kind: "arrive", text: `Arrive at ${destinationName}` })
  return steps
}

/** Compute path distance in pixels, then convert to approximate meters */
function computeRouteInfo(roomId: string) {
  const waypoints = ROUTE_CORNERS[roomId]
  if (!waypoints || waypoints.length < 2) return { distance: 0, eta: "—" }

  let totalPx = 0
  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i].x - waypoints[i - 1].x
    const dy = waypoints[i].y - waypoints[i - 1].y
    totalPx += Math.sqrt(dx * dx + dy * dy)
  }

  // Building is ~1450px wide ≈ 80m → 1px ≈ 0.055m
  const meters = Math.round(totalPx * 0.055)
  const seconds = Math.round(meters / 1.2) // ~1.2 m/s walking speed
  const eta = seconds >= 60 ? `${Math.floor(seconds / 60)} min ${seconds % 60}s` : `${seconds}s`

  return { distance: meters, eta, routeString: waypoints.map((p) => `${p.x},${p.y}`).join("|") }
}

export default function ARNavigationPage() {
  const router = useRouter()
  const [step, setStep] = useState<"select" | "ready" | "ar">("select")
  const [floor, setFloor] = useState<"ground" | "second" | "third" | "fourth" | "fifth">("ground")
  const [destination, setDestination] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [activeStepIdx, setActiveStepIdx] = useState(0)

  const floorConfig = FLOOR_CONFIG[floor]
  const elevatorId = floorConfig.elevatorId
  const destinationRoom = rooms.find((r) => r.id === destination)
  const floorLabel = floorConfig.label

  const filteredRooms = rooms.filter(
    (r) =>
      r.floor === floorConfig.label &&
      (r.roomName.toLowerCase().includes(search.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()))
  )

  const routeInfo = useMemo(() => {
    if (!destination || destination === elevatorId) return null
    return computeRouteInfo(destination)
  }, [destination, elevatorId])

  const steps = useMemo<RouteStep[]>(() => {
    if (!destination || !destinationRoom) return []
    const wp = ROUTE_CORNERS[destination]
    if (!wp) return []
    return buildSteps(wp, destinationRoom.roomName)
  }, [destination, destinationRoom])

  // Reset progress whenever destination changes
  useEffect(() => {
    setActiveStepIdx(0)
  }, [destination])

  const arSrc = useMemo(() => {
    if (!destination || !destinationRoom) return "/ar-view.html"
    const params = new URLSearchParams()
    params.set("dest", destinationRoom.roomName)
    params.set("num", destinationRoom.roomNumber)
    params.set("cat", destinationRoom.category)
    params.set("id", destination)
    params.set("dx", String(destinationRoom.coordinates.x))
    params.set("dy", String(destinationRoom.coordinates.y))
    params.set("map", floorConfig.mapImage)
    if (routeInfo?.routeString) params.set("route", routeInfo.routeString)
    if (routeInfo) {
      params.set("dist", `${routeInfo.distance}m`)
      params.set("eta", routeInfo.eta)
    }
    return `/ar-view.html?${params.toString()}`
  }, [destination, destinationRoom, routeInfo])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">

          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push("/")} className="mb-3 gap-2 -ml-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">AR Navigation</h1>
                <p className="text-xs text-muted-foreground sm:text-sm">Saint Benedict Hall — {floorLabel}</p>
              </div>
            </div>
          </div>

          {/* Step 1: Select Destination */}
          {step === "select" && (
            <div className="space-y-4">
              {/* Progress */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</div>
                <span className="text-sm font-medium text-foreground">Choose your destination</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">2</div>
                <span className="text-sm text-muted-foreground">Launch AR</span>
              </div>

              {/* Floor Tabs */}
              <div className="flex items-center rounded-lg border bg-muted p-1 gap-1 w-fit">
                <button
                  onClick={() => { setFloor("ground"); setDestination(null); }}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                    floor === "ground"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Ground Floor
                </button>
                <button
                  onClick={() => { setFloor("second"); setDestination(null); }}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                    floor === "second"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  2nd Floor
                </button>
                <button
                  onClick={() => { setFloor("third"); setDestination(null); }}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                    floor === "third"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  3rd Floor
                </button>
                <button
                  onClick={() => { setFloor("fourth"); setDestination(null); }}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                    floor === "fourth"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  4th Floor
                </button>
                <button
                  onClick={() => { setFloor("fifth"); setDestination(null); }}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                    floor === "fifth"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  5th Floor
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search rooms, offices, facilities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              {/* Room Grid */}
              <div className="grid gap-2 sm:grid-cols-2">
                {filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setDestination(destination === room.id ? null : room.id)}
                    className={`group relative rounded-xl border p-3 text-left transition-all hover:shadow-md ${
                      destination === room.id
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:bg-accent/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border text-lg ${CATEGORY_COLORS[room.category] || ""}`}>
                        {CATEGORY_ICONS[room.category] || "📍"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground text-sm truncate">{room.roomName}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{room.roomNumber}</div>
                        {room.capacity && (
                          <div className="text-xs text-muted-foreground mt-1">👥 {room.capacity} seats</div>
                        )}
                      </div>
                      {destination === room.id && (
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {filteredRooms.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No rooms found for &quot;{search}&quot;
                </div>
              )}

              {/* CTA */}
              <div className="sticky bottom-4 pt-2">
                <Button
                  onClick={() => setStep("ready")}
                  disabled={!destination}
                  className="w-full gap-2 h-12 text-base shadow-lg"
                  size="lg"
                >
                  <Navigation className="h-5 w-5" />
                  {destination ? `Navigate to ${destinationRoom?.roomName}` : "Select a destination first"}
                  {destination && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Ready screen */}
          {step === "ready" && destinationRoom && (
            <div className="space-y-4">
              {/* Progress */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">✓</div>
                <span className="text-sm text-muted-foreground">Destination selected</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</div>
                <span className="text-sm font-medium text-foreground">Launch AR</span>
              </div>

              {/* Destination Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-2xl ${CATEGORY_COLORS[destinationRoom.category] || ""}`}>
                      {CATEGORY_ICONS[destinationRoom.category] || "📍"}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Navigating to</div>
                      <div className="font-bold text-foreground text-lg leading-tight">{destinationRoom.roomName}</div>
                      <div className="text-xs font-mono text-muted-foreground">{destinationRoom.roomNumber}</div>
                    </div>
                    <button onClick={() => setStep("select")} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Distance & ETA */}
                  {routeInfo && routeInfo.distance > 0 && (
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-primary/10">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Route className="h-3.5 w-3.5 text-orange-500" />
                        <span>~{routeInfo.distance}m</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-orange-500" />
                        <span>~{routeInfo.eta} walk</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* How it works */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Info className="h-4 w-4 text-primary" />
                    Before you start
                  </div>
                  {[
                    { icon: "📄", text: "Print the Hiro marker from the AR Marker page" },
                    { icon: "📌", text: "Place it on a wall, desk, or floor near the elevator" },
                    { icon: "📷", text: "Allow camera access when prompted" },
                    { icon: "🎯", text: "Point camera at the marker — floor map with route appears" },
                    { icon: "🟢", text: "Green pin = You are here (Elevator start point)" },
                    { icon: "🟠", text: "Orange pin = Your destination with route path" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="text-base">{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AR Map Preview Legend */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">What You&apos;ll See</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { color: "bg-green-500", label: "Start Point", desc: "Elevator", shadow: "shadow-green-500/30" },
                      { color: "bg-orange-500", label: "Destination", desc: destinationRoom.roomName.length > 14 ? "Your Room" : destinationRoom.roomName, shadow: "shadow-orange-500/30" },
                      { color: "bg-orange-400", label: "Route Path", desc: "Follow the line", shadow: "shadow-orange-400/30" },
                    ].map(({ color, label, desc, shadow }) => (
                      <div key={label} className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-3">
                        <div className={`h-4 w-4 rounded-full ${color} shadow-lg ${shadow}`} />
                        <span className="text-xs font-medium text-foreground text-center">{label}</span>
                        <span className="text-[10px] text-muted-foreground text-center">{desc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                  Change Destination
                </Button>
                <Button variant="outline" onClick={() => router.push("/ar-marker")} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Get Marker
                </Button>
                <Button onClick={() => setStep("ar")} className="flex-1 gap-2 shadow-lg">
                  <Camera className="h-4 w-4" />
                  Launch AR
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: AR View */}
          {step === "ar" && (
            <div className="space-y-3">
              {/* Status bar */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5 flex-wrap">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-foreground">AR Active</span>
                  <Badge variant="outline" className="text-[10px] sm:text-xs gap-1 max-w-[160px] sm:max-w-none truncate">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{destinationRoom?.roomName}</span>
                  </Badge>
                  {routeInfo && routeInfo.distance > 0 && (
                    <Badge variant="secondary" className="text-[10px] sm:text-xs gap-1">
                      <Route className="h-3 w-3" />
                      ~{routeInfo.distance}m · {routeInfo.eta}
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => setStep("select")} className="gap-1 text-xs flex-shrink-0">
                  <X className="h-3 w-3" />
                  <span className="hidden sm:inline">Exit</span>
                </Button>
              </div>

              {/* AR iframe — portrait on phones, capped on larger screens */}
              <div
                className="relative mx-auto overflow-hidden rounded-2xl border bg-black shadow-2xl w-full max-w-sm sm:max-w-md"
                style={{ aspectRatio: "9/16", maxHeight: "70vh" }}
              >
                <iframe
                  src={arSrc}
                  className="h-full w-full border-0"
                  allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
                  title="AR Ground Floor Navigation"
                />

                {/* Bottom HUD overlay */}
                <div className="pointer-events-none absolute bottom-4 left-4 right-4">
                  <div className="rounded-xl bg-black/70 backdrop-blur-md border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-white/60">Navigating to</div>
                        <div className="text-sm font-semibold text-white">{destinationRoom?.roomName}</div>
                      </div>
                      {routeInfo && routeInfo.distance > 0 && (
                        <div className="text-right">
                          <div className="text-xs text-orange-400 font-medium">~{routeInfo.distance}m</div>
                          <div className="text-[10px] text-white/50">{routeInfo.eta} walk</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Point your camera at the printed Hiro marker to see the floor map with navigation route
              </p>

              {/* Turn-by-turn directions */}
              {steps.length > 0 && (
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-semibold text-foreground">Turn-by-turn</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Step {Math.min(activeStepIdx + 1, steps.length)} of {steps.length}
                      </span>
                    </div>

                    <ol className="space-y-2 mb-3">
                      {steps.map((s, i) => {
                        const isDone = i < activeStepIdx
                        const isActive = i === activeStepIdx
                        const Icon =
                          s.kind === "start" ? CircleDot :
                          s.kind === "left" ? CornerUpLeft :
                          s.kind === "right" ? CornerUpRight :
                          s.kind === "arrive" ? Flag :
                          ArrowUp
                        return (
                          <li
                            key={i}
                            className={`flex items-start gap-3 rounded-lg border p-2.5 transition-all ${
                              isActive
                                ? "border-orange-500/40 bg-orange-500/5 shadow-sm ring-1 ring-orange-500/20"
                                : isDone
                                  ? "border-border/60 bg-muted/30 opacity-60"
                                  : "border-border bg-card"
                            }`}
                          >
                            <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
                              isActive ? "bg-orange-500 text-white"
                                : isDone ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {isDone ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm leading-tight ${
                                isActive ? "font-semibold text-foreground" : "text-foreground/80"
                              }`}>
                                {s.text}
                              </div>
                              {s.meters && (
                                <div className="text-[11px] text-muted-foreground mt-0.5">~{s.meters}m</div>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ol>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                        disabled={activeStepIdx === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => setActiveStepIdx((i) => Math.min(steps.length - 1, i + 1))}
                        disabled={activeStepIdx >= steps.length - 1}
                      >
                        Next step
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
