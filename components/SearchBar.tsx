"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { rooms, schedules } from "@/lib/dummyData"
import { searchRooms } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { Room } from "@/types/room"

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({ placeholder = "Search rooms, faculty, or subjects...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Room[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length > 0) {
      const filteredRooms = searchRooms(query, rooms, schedules)
      setResults(filteredRooms.slice(0, 5))
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [query])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleResultClick = (roomId: string) => {
    setQuery("")
    setShowResults(false)
    router.push(`/room/${roomId}`)
  }

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 pl-10 pr-4 text-base"
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-card shadow-lg">
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.map((room) => (
              <button
                key={room.id}
                onClick={() => handleResultClick(room.id)}
                className="flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-card-foreground">{room.roomName}</div>
                  <div className="text-sm text-muted-foreground">{room.roomNumber}</div>
                  {room.assignedFaculty && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {room.assignedFaculty}
                    </div>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {room.floor}
                    </span>
                    <span className="text-xs text-muted-foreground">{room.category}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showResults && results.length === 0 && query.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-card p-4 shadow-lg">
          <p className="text-center text-sm text-muted-foreground">No rooms found</p>
        </div>
      )}
    </div>
  )
}
