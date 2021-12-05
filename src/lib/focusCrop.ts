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

export const scalePoint = ({ x, y }: Point, { width, height }: Size): Point => ({
  x: x * width,
  y: y * height,
})

export const scaleSize = (s1: Size, s2: Size): Size => ({
  width: s1.width * s2.width,
  height: s1.height * s2.height,
})

export const scaleCropping = ({ focus, clip }: Cropping, size: Size): Cropping => ({
  focus: scalePoint(focus, size),
  clip: { ...scalePoint(clip, size), ...scaleSize(clip, size) },
})

export const ratioFromString = (ratio: string) => {
  const [w, h] = ratio.split(':').map(Number)
  if (!(w && h && w > 0 && h > 0)) throw Error(`invalid ratio: ${ratio}`)
  return w / h
}

/**
 *  Calculates a rectangle with a desired ratio centered around a focus point
 *  from a source rectangle. The calculated rectangle has either the same
 *  width or the same height of the source rectangle.
 */
export const focusCrop = (ratio: number, { focus, clip }: Cropping): Rectangle => {
  // depending on the ratio keep either the width or the height of the clip rectangle
  // and calculate the other dimension from the desired ratio
  const clipRatio = clip.width / clip.height
  if (clipRatio < ratio) {
    const newHeight = clip.width / ratio
    // calculate top of rect centered around focus point y
    const newY = center(focus.y, newHeight, clip.y, clip.y + clip.height)
    return { x: clip.x, y: newY, width: clip.width, height: newHeight }
  } else {
    const newWidth = clip.height * ratio
    // calculate left of rect centered around focus point x
    const newX = center(focus.x, newWidth, clip.x, clip.x + clip.width)
    return { x: newX, y: clip.y, width: newWidth, height: clip.height }
  }
}

/** position interval with length around center and return the start of the centered interval
 *  ensures that the interval stays in [min, max] bounds
 *  if start < min then start = min
 *  if stop > max then stop = max
 *  */
const center = (center: number, length: number, min: number, max: number): number => {
  const start = center - length / 2
  return Math.min(Math.max(start, min) + length, max) - length
}
