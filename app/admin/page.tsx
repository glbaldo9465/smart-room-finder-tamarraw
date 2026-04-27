import { Home, MapIcon, Navigation, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { rooms, floors, navigationPaths } from "@/lib/dummyData"

export default function AdminDashboard() {
  const totalRooms = rooms.length
  const totalFloors = floors.length
  const totalPaths = navigationPaths.length
  const availableRooms = rooms.filter((r) => r.isAvailable).length

  const recentRooms = rooms.slice(0, 5)

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of the Smart Room Finder system</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalRooms}</div>
            <p className="text-xs text-muted-foreground">{availableRooms} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Floor Levels</CardTitle>
            <MapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalFloors}</div>
            <p className="text-xs text-muted-foreground">Ground to 3rd floor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Navigation Paths</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalPaths}</div>
            <p className="text-xs text-muted-foreground">Active routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">Active</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{room.roomName}</div>
                    <div className="text-sm text-muted-foreground">{room.roomNumber}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{room.floor}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database Status</span>
                <span className="font-medium text-accent">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AR Engine</span>
                <span className="font-medium text-accent">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium text-foreground">Today</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium text-foreground">1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
