"use client"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import { useRouter } from "next/navigation"

export default function MapError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  return (
    <>
      <Navbar />
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            Failed to load floor map
          </h2>
          <p className="text-sm text-muted-foreground">
            The map could not be displayed. This may be due to a 3D rendering issue.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={reset}>Retry</Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
