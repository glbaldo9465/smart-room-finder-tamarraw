"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowLeft, Printer, Download, Info } from "lucide-react"

export default function ARMarkerPage() {
  const router = useRouter()

  const handlePrint = () => window.print()

  return (
    <>
      {/* Hide navbar/footer when printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-area { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div className="no-print">
        <Navbar />
      </div>

      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-6 lg:py-10">

          {/* Header */}
          <div className="no-print mb-6">
            <Button variant="ghost" onClick={() => router.push("/ar")} className="mb-3 gap-2 -ml-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to AR
            </Button>
            <h1 className="text-2xl font-bold text-foreground mb-1">AR Marker — Print This Page</h1>
            <p className="text-sm text-muted-foreground">
              Print and place this marker on a wall, desk, or floor. The AR camera will detect it and anchor the floor map.
            </p>
          </div>

          {/* Instructions */}
          <Card className="no-print mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <Info className="h-4 w-4 text-primary" />
                How to use
              </div>
              {[
                "Print this page in black & white on A4 or Letter paper",
                "Cut out the marker along the outer border",
                "Place it on a flat surface — wall, desk, or floor near the elevator",
                "Open the AR page, point your camera at the marker",
                "The floor map with navigation route will appear instantly",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mt-0.5">{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Print buttons */}
          <div className="no-print flex gap-3 mb-8">
            <Button onClick={handlePrint} className="gap-2 flex-1">
              <Printer className="h-4 w-4" />
              Print Marker
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <a href="https://raw.githack.com/AR-js-org/AR.js/master/data/images/hiro.png" download="hiro-marker.png" target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                Download PNG
              </a>
            </Button>
          </div>

          {/* Printable marker area */}
          <div className="print-area flex flex-col items-center gap-6 rounded-2xl border-2 border-dashed border-border bg-card p-8">
            {/* Print header */}
            <div className="text-center">
              <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1 no-print">Hiro AR Marker</div>
              <div className="text-lg font-bold text-foreground">Saint Benedict Hall</div>
              <div className="text-sm text-muted-foreground">AR Navigation Marker — All Floors</div>
            </div>

            {/* The Hiro marker image */}
            <div className="relative">
              {/* White border required for AR detection */}
              <div className="bg-white p-4 shadow-lg rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://raw.githack.com/AR-js-org/AR.js/master/data/images/hiro.png"
                  alt="Hiro AR Marker"
                  width={280}
                  height={280}
                  style={{ display: "block", imageRendering: "pixelated" }}
                />
              </div>
              {/* Corner labels */}
              <div className="absolute -top-2 -left-2 text-xs font-mono text-muted-foreground bg-background px-1 no-print">HIRO</div>
            </div>

            {/* Important note */}
            <div className="text-center space-y-1 max-w-xs">
              <p className="text-xs font-semibold text-foreground">⚠️ Keep white border intact</p>
              <p className="text-xs text-muted-foreground">
                The white border around the black pattern is required for AR detection. Do not crop it.
              </p>
            </div>

            {/* Print footer */}
            <div className="w-full border-t pt-4 text-center text-xs text-muted-foreground">
              Saint Benedict Hall Navigation System &nbsp;·&nbsp; Scan with AR Camera at <strong>/ar</strong>
            </div>
          </div>

          {/* Placement tips */}
          <div className="no-print mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: "🖨️", title: "Print Size", desc: "A4 works best. Larger = better tracking distance" },
              { icon: "💡", title: "Lighting", desc: "Good lighting helps. Avoid glare on the marker" },
              { icon: "📐", title: "Flat Surface", desc: "Tape on a wall or place on a flat desk or floor" },
            ].map(({ icon, title, desc }) => (
              <Card key={title}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-sm font-semibold text-foreground mb-1">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </main>
      <div className="no-print">
        <Footer />
      </div>
    </>
  )
}
