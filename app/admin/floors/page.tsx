"use client"

import { useState } from "react"
import { Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/DataTable"
import { floors } from "@/lib/dummyData"
import type { Floor } from "@/types/floor"
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

export default function AdminFloorsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null)

  const handleEdit = (floor: Floor) => {
    setSelectedFloor(floor)
    setIsEditModalOpen(true)
  }

  const columns = [
    {
      header: "Floor Name",
      accessor: "floorName",
    },
    {
      header: "Floor Number",
      accessor: "floorNumber",
      render: (value: number) => <Badge variant="outline">{value}</Badge>,
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Total Rooms",
      accessor: "totalRooms",
    },
  ]

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Floors Management</h1>
          <p className="text-muted-foreground">Manage floor layouts and information</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Floor
        </Button>
      </div>

      {/* Data Table */}
      <DataTable data={floors} columns={columns} onEdit={handleEdit} />

      {/* Add Floor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Floor</DialogTitle>
            <DialogDescription>Enter the floor details and upload the floor map.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="floorName">Floor Name</Label>
              <Input id="floorName" placeholder="4th Floor" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="floorNumber">Floor Number</Label>
              <Input id="floorNumber" type="number" placeholder="3" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="floorDescription">Description</Label>
              <Input id="floorDescription" placeholder="Executive offices..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mapUpload">Floor Map Image</Label>
              <div className="flex items-center gap-2">
                <Input id="mapUpload" type="file" accept="image/*" />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Upload a PNG or JPG file of the floor plan</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddModalOpen(false)}>Add Floor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Floor Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Floor</DialogTitle>
            <DialogDescription>Update the floor details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editFloorName">Floor Name</Label>
              <Input id="editFloorName" defaultValue={selectedFloor?.floorName} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editFloorDescription">Description</Label>
              <Input id="editFloorDescription" defaultValue={selectedFloor?.description} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editMapUpload">Update Floor Map</Label>
              <div className="flex items-center gap-2">
                <Input id="editMapUpload" type="file" accept="image/*" />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
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
