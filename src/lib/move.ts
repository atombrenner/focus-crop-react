import { Cropping } from './model'

type Horizontal = 'left' | 'right'
type Vertical = 'top' | 'bottom'
export type MoveFn = 'focus' | Horizontal | Vertical | `${Vertical}${Capitalize<Horizontal>}`
export type MoveFnType = (cropping: Cropping, dx: number, dy: number) => Cropping
export type Move = Readonly<Record<MoveFn, MoveFnType>>

const minDist = 0.2 // minimal height and width of the cropping rectangle

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

export const move: Move = (function () {
  const left = ({ clip, focus }: Cropping, dx: number, _dy: number) => {
    const delta = clamp(dx, -clip.x, clip.width - minDist)
    return { focus, clip: { ...clip, x: clip.x + delta, width: clip.width - delta } }
  }

  const right = ({ clip, focus }: Cropping, dx: number, _dy: number) => {
    const delta = clamp(dx, minDist - clip.width, 1 - clip.x - clip.width)
    return { focus, clip: { ...clip, width: clip.width + delta } }
  }

  const top = ({ clip, focus }: Cropping, _dx: number, dy: number) => {
    const delta = clamp(dy, -clip.y, clip.height - minDist)
    return { focus, clip: { ...clip, y: clip.y + delta, height: clip.height - delta } }
  }

  const bottom = ({ clip, focus }: Cropping, _dx: number, dy: number) => {
    const delta = clamp(dy, minDist - clip.height, 1 - clip.y - clip.height)
    return { focus, clip: { ...clip, height: clip.height + delta } }
  }

  const topLeft = (cropping: Cropping, dx: number, dy: number) =>
    top(left(cropping, dx, dy), dx, dy)

  const topRight = (cropping: Cropping, dx: number, dy: number) =>
    top(right(cropping, dx, dy), dx, dy)

  const bottomLeft = (cropping: Cropping, dx: number, dy: number) =>
    bottom(left(cropping, dx, dy), dx, dy)

  const bottomRight = (cropping: Cropping, dx: number, dy: number) =>
    bottom(right(cropping, dx, dy), dx, dy)

  const focus = ({ clip, focus }: Cropping, dx: number, dy: number) => ({
    clip,
    focus: {
      x: clamp(focus.x + dx, 0, 1),
      y: clamp(focus.y + dy, 0, 1),
    },
  })

  return { focus, topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left }
})()