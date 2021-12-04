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

/**
 *  Calculates a rectangle with a desired ratio centered around a focus point
 *  from a source rectangle. The calculated rectangle has either the same
 *  width or the same height of the source rectangle.
 */
export const focusCrop = (ratio: number, size: Size, { focus, clip }: Cropping): Rectangle => {
  // transform relative cropping into original coordinates
  const srcX = clip.x * size.width
  const srcWidth = clip.width * size.width
  const srcY = clip.y * size.height
  const srcHeight = clip.height * size.height

  // depending on the ratio keep either the width or the height
  // and calculate the other dimension from the desired ratio
  const srcRatio = srcWidth / srcHeight
  if (srcRatio < ratio) {
    const newHeight = srcWidth / ratio
    // calculate top of rect centered around focus point y
    const srcFocusY = focus.y * size.height
    const newY = center(srcFocusY, newHeight, srcY, srcY + srcHeight)
    return { x: srcX, y: newY, width: srcWidth, height: newHeight }
  } else {
    const newWidth = srcHeight * ratio
    // calculate left of rect centered around focus point x
    const srcFocusX = focus.x * size.width
    const newX = center(srcFocusX, newWidth, srcX, srcX + srcWidth)
    return { x: newX, y: srcY, width: newWidth, height: srcHeight }
  }
}

/** position interval with length around center and return the start of the centered interval
 *  ensures that the interval stays in [min, max] bounds
 *  if start < min then start = min
 *  if stop > max then stop = max
 *  */
function center(center: number, length: number, min: number, max: number): number {
  const start = center - length / 2
  return Math.min(Math.max(start, min) + length, max) - length
}
