export type Point = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type Rectangle = Point & Size

export type Cropping = {
  focus: Point
  clip: Rectangle
}
