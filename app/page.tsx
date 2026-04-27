"use client"

import { motion } from "framer-motion"
import { ArrowRight, Map, Camera, Search, Navigation, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SearchBar from "@/components/SearchBar"
import RoomCard from "@/components/RoomCard"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { rooms } from "@/lib/dummyData"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const featuredRooms = rooms.slice(0, 6)

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm">
                <MapPin className="h-4 w-4 text-primary" />
                Saint Benedict Hall Navigation System
              </div>

              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Find Your Way in{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Saint Benedict Hall
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground">
                Navigate Saint Benedict Hall's Ground Floor with ease. Search for computer labs, offices, and
                facilities, then use AR navigation to find your way.
              </p>

              {/* CTA Buttons */}
              <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" onClick={() => router.push("/map/ground-floor")} className="gap-2">
                  <Map className="h-5 w-5" />
                  View Ground Floor Map
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/ar")} className="gap-2">
                  <Camera className="h-5 w-5" />
                  Start AR Navigation
                </Button>
              </div>

              {/* Search Bar */}
              <div className="mx-auto max-w-2xl">
                <SearchBar placeholder="Search rooms by name, number, or floor..." />
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full opacity-50">
              <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
              <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-b bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-12 text-center text-3xl font-bold text-foreground">How It Works</h2>

              <div className="grid gap-8 md:grid-cols-3">
                {/* Feature 1 */}
                <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Search className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">Search Rooms</h3>
                    <p className="text-muted-foreground">
                      Find computer labs, offices, and facilities on the ground floor quickly and easily.
                    </p>
                  </CardContent>
                </Card>

                {/* Feature 2 */}
                <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                      <Map className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">Interactive Floor Plan</h3>
                    <p className="text-muted-foreground">
                      Browse the detailed ground floor evacuation plan with clickable room markers.
                    </p>
                  </CardContent>
                </Card>

                {/* Feature 3 */}
                <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Navigation className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">AR Navigation</h3>
                    <p className="text-muted-foreground">
                      Use marker-based AR to follow visual directions directly through your camera.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Rooms Section */}
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-12 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Ground Floor Rooms</h2>
                  <p className="mt-2 text-muted-foreground">
                    Computer laboratories and facilities in Saint Benedict Hall
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <RoomCard room={room} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-2 text-4xl font-bold text-primary">{rooms.length}</div>
                <div className="text-sm font-medium text-muted-foreground">Ground Floor Rooms</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="mb-2 text-4xl font-bold text-primary">3</div>
                <div className="text-sm font-medium text-muted-foreground">Computer Labs</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="mb-2 text-4xl font-bold text-primary">24/7</div>
                <div className="text-sm font-medium text-muted-foreground">Accessibility</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-gradient-to-br from-primary/5 to-accent/5 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="mb-4 text-3xl font-bold text-foreground">Ready to Find Your Room?</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Start exploring Saint Benedict Hall Ground Floor with AR navigation
              </p>
              <Button size="lg" onClick={() => router.push("/map/ground-floor")} className="gap-2">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
