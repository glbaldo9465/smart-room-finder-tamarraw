"use client"

import { type ReactNode, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScrollableMapContainerProps {
  children: ReactNode
  className?: string
}

export default function ScrollableMapContainer({ children, className = "" }: ScrollableMapContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollHint, setShowScrollHint] = useState(true)

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 300, behavior: "smooth" })
  }

  const scrollUp = () => {
    scrollRef.current?.scrollBy({ top: -300, behavior: "smooth" })
  }

  const handleScroll = () => {
    setShowScrollHint(false)
  }

  return (
    <div className="relative">
      {/* Scroll Up Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-1/2 top-4 z-10 -translate-x-1/2 shadow-lg"
        onClick={scrollUp}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`relative h-[600px] overflow-y-auto scroll-smooth ${className}`}
      >
        {children}

        {/* Scroll Hint */}
        {showScrollHint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-8">
            <div className="animate-bounce rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg">
              Scroll to explore
            </div>
          </div>
        )}
      </div>

      {/* Scroll Down Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 shadow-lg"
        onClick={scrollDown}
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  )
}
