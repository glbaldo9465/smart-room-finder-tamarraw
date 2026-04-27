"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { floors } from "@/lib/dummyData"

export default function FloorSelector() {
  const router = useRouter()
  const pathname = usePathname()

  const getFloorPath = (floorNumber: number) => {
    switch (floorNumber) {
      case 0:
        return "/map/ground-floor"
      case 1:
        return "/map/second-floor"
      case 2:
        return "/map/third-floor"
      case 3:
        return "/map/fourth-floor"
      case 4:
        return "/map/fifth-floor"
      default:
        return "/map/ground-floor"
    }
  }

  const isActiveFloor = (floorNumber: number) => {
    const floorPath = getFloorPath(floorNumber)
    return pathname === floorPath
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-card p-1 shadow-sm">
      {floors.map((floor) => (
        <Button
          key={floor.id}
          variant={isActiveFloor(floor.floorNumber) ? "default" : "ghost"}
          size="sm"
          onClick={() => router.push(getFloorPath(floor.floorNumber))}
          className="rounded-full"
        >
          {floor.floorName}
        </Button>
      ))}
    </div>
  )
}
