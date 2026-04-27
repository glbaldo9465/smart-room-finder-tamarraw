import Link from "next/link"
import { MapPin, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Smart Room Finder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AR-powered indoor navigation system for Our Lady of Fatima University Tamaraw Building. Find any room
              quickly and efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/map/ground-floor" className="text-muted-foreground hover:text-primary transition-colors">
                  Floor Maps
                </Link>
              </li>
              <li>
                <Link href="/ar" className="text-muted-foreground hover:text-primary transition-colors">
                  AR Navigation
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contact Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Tamaraw Building, OLFU Campus
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@olfu.edu.ph
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +63 (2) 1234-5678
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Our Lady of Fatima University. All rights reserved.</p>
          <p className="mt-1">Developed by: Reyes, Rodriguez, Baldo, Robles</p>
        </div>
      </div>
    </footer>
  )
}
