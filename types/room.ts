export interface Room {
  id: string
  roomName: string
  roomNumber: string
  description: string
  floor: "Ground Floor" | "2nd Floor" | "3rd Floor" | "4th Floor" | "5th Floor"
  floorNumber: number
  coordinates: {
    x: number
    y: number
  }
  category: "Classroom" | "Laboratory" | "Office" | "Conference Room" | "Faculty Room" | "Storage" | "Store" | "Facilities" | "Navigation" | "Education and Training" | "Stock Room" | "Library" | "Clinic" | "IT" | "Pantry" | "Printing"
  assignedFaculty?: string
  capacity?: number
  amenities?: string[]
  isAvailable: boolean
}
