"use client"

import Link from "next/link"
import { useState } from "react"
import { MapPin, Menu, X, Home, Map, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-foreground">Smart Room Finder</div>
              <div className="text-xs text-muted-foreground">Tamaraw Building</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/map/ground-floor"
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <Map className="h-4 w-4" />
              Ground Floor Map
            </Link>
            <Link
              href="/ar"
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <Camera className="h-4 w-4" />
              AR Navigation
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/map/ground-floor"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Map className="h-4 w-4" />
                Ground Floor Map
              </Link>
              <Link
                href="/ar"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Camera className="h-4 w-4" />
                AR Navigation
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
