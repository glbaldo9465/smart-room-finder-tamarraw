"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/DataTable"
import { navigationPaths, rooms } from "@/lib/dummyData"
import type { NavigationPath } from "@/types/path"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function AdminPathsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPath, setSelectedPath] = useState<NavigationPath | null>(null)

  const handleEdit = (path: NavigationPath) => {
    setSelectedPath(path)
    setIsEditModalOpen(true)
  }

  const getRoomName = (roomId: string) => {
    return rooms.find((r) => r.id === roomId)?.roomName || "Unknown"
  }

  const columns = [
    {
      header: "From Room",
      accessor: "fromRoom",
      render: (value: string) => getRoomName(value),
    },
    {
      header: "To Room",
      accessor: "toRoom",
      render: (value: string) => getRoomName(value),
    },
    {
      header: "Distance",
      accessor: "distance",
      render: (value: number) => `${value}m`,
    },
    {
      header: "Est. Time",
      accessor: "estimatedTime",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
  ]

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Navigation Paths</h1>
          <p className="text-muted-foreground">Manage navigation routes between rooms</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Path
        </Button>
      </div>

      {/* Data Table */}
      <DataTable data={navigationPaths} columns={columns} onEdit={handleEdit} />

      {/* Add Path Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Navigation Path</DialogTitle>
            <DialogDescription>Define a new navigation path between two rooms.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fromRoom">From Room ID</Label>
              <Input id="fromRoom" placeholder="1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="toRoom">To Room ID</Label>
              <Input id="toRoom" placeholder="2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pathCoords">Path Coordinates (JSON)</Label>
              <Input id="pathCoords" placeholder='[{"x": 120, "y": 200}, {"x": 220, "y": 200}]' />
              <p className="text-xs text-muted-foreground">Enter coordinates as a JSON array</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="distance">Distance (meters)</Label>
              <Input id="distance" type="number" placeholder="150" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input id="estimatedTime" placeholder="45 sec" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddModalOpen(false)}>Add Path</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Path Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Navigation Path</DialogTitle>
            <DialogDescription>Update the path details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editDistance">Distance (meters)</Label>
              <Input id="editDistance" type="number" defaultValue={selectedPath?.distance} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editEstimatedTime">Estimated Time</Label>
              <Input id="editEstimatedTime" defaultValue={selectedPath?.estimatedTime} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPathCoords">Path Coordinates (JSON)</Label>
              <Input id="editPathCoords" defaultValue={JSON.stringify(selectedPath?.pathCoordinates)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditModalOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
