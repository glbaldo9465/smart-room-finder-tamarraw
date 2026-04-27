export interface NavigationPath {
  id: string
  fromRoom: string
  toRoom: string
  pathCoordinates: Array<{ x: number; y: number }>
  distance: number
  estimatedTime: string
}
