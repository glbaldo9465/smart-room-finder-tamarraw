"use client"

import { Camera, Scan } from "lucide-react"

export default function ARPlaceholder() {
  return (
    <div className="ar-frame relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-4 border-primary bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Corner Markers */}
      <div className="absolute left-4 top-4 h-8 w-8 border-l-4 border-t-4 border-primary"></div>
      <div className="absolute right-4 top-4 h-8 w-8 border-r-4 border-t-4 border-primary"></div>
      <div className="absolute bottom-4 left-4 h-8 w-8 border-b-4 border-l-4 border-primary"></div>
      <div className="absolute bottom-4 right-4 h-8 w-8 border-b-4 border-r-4 border-primary"></div>

      {/* Center Content */}
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Camera className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-foreground">AR Camera View</h3>
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
          Point your camera at AR markers to see navigation guides
        </p>

        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
          <Scan className="h-4 w-4 animate-pulse text-primary" />
          <span className="text-sm font-medium text-primary">Scanning for markers...</span>
        </div>
      </div>

      {/* Scanning Line Animation */}
      <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-gradient-to-r from-transparent via-primary to-transparent"></div>
    </div>
  )
}
