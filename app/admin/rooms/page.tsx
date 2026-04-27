"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/DataTable"
import { rooms as initialRooms } from "@/lib/dummyData"
import type { Room } from "@/types/room"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES: Room["category"][] = [
  "Education and Training",
  "Office",
  "Stock Room",
  "Facilities",
  "Classroom",
  "Laboratory",
  "Conference Room",
  "Faculty Room",
  "Storage",
  "Store",
  "Navigation",
]

const FLOORS: Room["floor"][] = ["Ground Floor", "2nd Floor", "3rd Floor"]

export default function AdminRoomsPage() {
  const [roomList, setRoomList] = useState<Room[]>(initialRooms)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    roomName: "",
    roomNumber: "",
    description: "",
    floor: "Ground Floor" as Room["floor"],
    category: "Classroom" as Room["category"],
    assignedFaculty: "",
    capacity: "",
    coordX: "",
    coordY: "",
  })

  const filteredRooms = roomList.filter(
    (room) =>
      room.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.assignedFaculty?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      roomName: "",
      roomNumber: "",
      description: "",
      floor: "Ground Floor",
      category: "Classroom",
      assignedFaculty: "",
      capacity: "",
      coordX: "",
      coordY: "",
    })
  }

  const handleAdd = () => {
    const newRoom: Room = {
      id: String(Date.now()),
      roomName: formData.roomName,
      roomNumber: formData.roomNumber,
      description: formData.description,
      floor: formData.floor,
      floorNumber: FLOORS.indexOf(formData.floor),
      coordinates: {
        x: parseInt(formData.coordX) || 0,
        y: parseInt(formData.coordY) || 0,
      },
      category: formData.category,
      assignedFaculty: formData.assignedFaculty || undefined,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      isAvailable: true,
    }
    setRoomList([...roomList, newRoom])
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleEdit = (room: Room) => {
    setSelectedRoom(room)
    setFormData({
      roomName: room.roomName,
      roomNumber: room.roomNumber,
      description: room.description,
      floor: room.floor,
      category: room.category,
      assignedFaculty: room.assignedFaculty || "",
      capacity: room.capacity ? String(room.capacity) : "",
      coordX: String(room.coordinates.x),
      coordY: String(room.coordinates.y),
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (!selectedRoom) return
    setRoomList(
      roomList.map((room) =>
        room.id === selectedRoom.id
          ? {
              ...room,
              roomName: formData.roomName,
              roomNumber: formData.roomNumber,
              description: formData.description,
              floor: formData.floor,
              floorNumber: FLOORS.indexOf(formData.floor),
              coordinates: {
                x: parseInt(formData.coordX) || 0,
                y: parseInt(formData.coordY) || 0,
              },
              category: formData.category,
              assignedFaculty: formData.assignedFaculty || undefined,
              capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
            }
          : room,
      ),
    )
    setIsEditModalOpen(false)
    resetForm()
    setSelectedRoom(null)
  }

  const handleDelete = (room: Room) => {
    setSelectedRoom(room)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedRoom) return
    setRoomList(roomList.filter((room) => room.id !== selectedRoom.id))
    setIsDeleteModalOpen(false)
    setSelectedRoom(null)
  }

  const columns = [
    {
      header: "Room Name",
      accessor: "roomName",
    },
    {
      header: "Room Number",
      accessor: "roomNumber",
    },
    {
      header: "Floor",
      accessor: "floor",
    },
    {
      header: "Category",
      accessor: "category",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      header: "Faculty",
      accessor: "assignedFaculty",
      render: (value: string) =>
        value ? (
          <span className="text-sm">{value}</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      header: "Status",
      accessor: "isAvailable",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>{value ? "Available" : "Restricted"}</Badge>
      ),
    },
  ]

  const RoomFormFields = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Room Name</Label>
          <Input
            value={formData.roomName}
            onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
            placeholder="Computer Laboratory 1"
          />
        </div>
        <div className="grid gap-2">
          <Label>Room Number</Label>
          <Input
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            placeholder="SBH-GF-CL1"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Description</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Main computer laboratory..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Floor</Label>
          <Select
            value={formData.floor}
            onValueChange={(val) => setFormData({ ...formData, floor: val as Room["floor"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FLOORS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(val) => setFormData({ ...formData, category: val as Room["category"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Assigned Faculty</Label>
        <Input
          value={formData.assignedFaculty}
          onChange={(e) => setFormData({ ...formData, assignedFaculty: e.target.value })}
          placeholder="Prof. Juan Dela Cruz"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label>Capacity</Label>
          <Input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="35"
          />
        </div>
        <div className="grid gap-2">
          <Label>Coordinate X</Label>
          <Input
            type="number"
            value={formData.coordX}
            onChange={(e) => setFormData({ ...formData, coordX: e.target.value })}
            placeholder="250"
          />
        </div>
        <div className="grid gap-2">
          <Label>Coordinate Y</Label>
          <Input
            type="number"
            value={formData.coordY}
            onChange={(e) => setFormData({ ...formData, coordY: e.target.value })}
            placeholder="450"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Rooms Management</h1>
          <p className="text-muted-foreground">Manage all rooms in the Tamaraw Building</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search rooms or faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={filteredRooms} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Add Room Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>Enter the details of the new room below.</DialogDescription>
          </DialogHeader>
          <RoomFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!formData.roomName || !formData.roomNumber}>
              Add Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update the room details below.</DialogDescription>
          </DialogHeader>
          <RoomFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedRoom?.roomName}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
