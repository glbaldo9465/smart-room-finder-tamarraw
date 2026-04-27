"use client"

import type { Room } from "@/types/room"
import { MapPin, Users, Navigation } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const router = useRouter()

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{room.roomName}</CardTitle>
            <CardDescription className="mt-1">{room.roomNumber}</CardDescription>
          </div>
          <Badge variant={room.isAvailable ? "default" : "secondary"} className="ml-2">
            {room.isAvailable ? "Available" : "Restricted"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{room.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {room.floor}
          </div>
          {room.capacity && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {room.capacity} seats
            </div>
          )}
          <Badge variant="outline" className="text-xs">
            {room.category}
          </Badge>
        </div>

        <Button onClick={() => router.push(`/room/${room.id}`)} className="w-full" size="sm">
          <Navigation className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
