import React, { ReactEventHandler, PointerEventHandler, useState, useRef, useEffect } from 'react'
import { move, MoveFn, zoom } from './move'
import { Point, Rectangle, Cropping, Size } from './focusCrop'

import './ImageCropper.css'

type Drag = Readonly<{
  target: HTMLElement
  pointerId: number
  point: Point
  cropping: Cropping
  moveFn: MoveFn
}>

const isPrimaryLeftButton = (e: React.PointerEvent) => e.isPrimary && e.button === 0

const isHTMLElement = (target: EventTarget): target is HTMLElement => target instanceof HTMLElement

const dragTo = (to: Point, drag: Drag) => {
  const dx = to.x - drag.point.x
  const dy = to.y - drag.point.y
  return move[drag.moveFn](drag.cropping, dx, dy)
}

export type ImageCropperProps = {
  src: string
  cropping: Cropping
  onLoad: (image: HTMLImageElement) => void
  onChange: (cropping: Cropping) => void
} & Pick<React.HTMLProps<HTMLDivElement>, 'className'>

export const ImageCropper = ({ src, cropping, onLoad, onChange, className }: ImageCropperProps) => {
  const [drag, setDrag] = useState<Drag>()
  const [dragPoint, setDragPoint] = useState<Point>()
  const [isLoaded, setIsLoaded] = useState(false)
  const [size, setSize] = useState<Size>()

  const cancelDrag = () => {
    if (drag) {
      drag.target.releasePointerCapture(drag.pointerId)
      setDrag(undefined)
      onChange(drag.cropping)
    }
  }

  const onPointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isPrimaryLeftButton(e) || !isHTMLElement(e.target)) return
    const point = getRelativePoint(e)
    const { target, pointerId } = e
    setDragPoint(point)
    target.setPointerCapture(pointerId)

    const moveFn = target.dataset?.moveFn as MoveFn
    if (moveFn) {
      setDrag({ target, pointerId, point, cropping, moveFn })
    } else {
      // set focus point and start dragging
      const newCropping = { ...cropping, focus: point }
      if (point.x !== newCropping.focus.x || point.y !== newCropping.focus.y) return
      onChange(newCropping)
      setDrag({ target, pointerId, point, cropping: newCropping, moveFn: 'focus' })
    }
    e.target.setPointerCapture(e.pointerId)
  }

  const onPointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!e.isPrimary || !drag) return

    const point = getRelativePoint(e)
    setDragPoint(point)

    const newCropping = dragTo(point, drag)
    onChange(newCropping)
  }

  if (drag && dragPoint) {
    const newCropping = dragTo(dragPoint, drag)
    if (JSON.stringify(newCropping.clip) !== JSON.stringify(cropping.clip)) onChange(newCropping)
  }

  const onPointerUp: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isPrimaryLeftButton(e) || !isHTMLElement(e.target) || !drag) return
    e.target.releasePointerCapture(drag.pointerId)
    setDrag(undefined)
  }

  const onImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    setSize({ width: e.currentTarget.width, height: e.currentTarget.height })
    onLoad(e.currentTarget)
    setIsLoaded(true)
  }

  // With React's synthetic event system it is not possible to have an active
  // wheel event listener that can prevent the default of scrolling the page.
  // Instead we have to get a ref and attach a native event handler.
  // For more details see this issue https://github.com/facebook/react/issues/14856
  const refForMouseWheel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!size || !refForMouseWheel.current) return
    const { width, height } = cropping.clip
    const onWheel = (e: WheelEvent) => {
      const growth = (Math.sign(e.deltaY) * 8) / Math.min(size.width * width, size.height * height)
      const factorX = (width + growth) / width
      const factorY = (height + growth) / height
      const limit = e.deltaY > 0 ? Math.max : Math.min
      onChange(zoom(cropping, limit(factorX, factorY)))
      e.preventDefault()
    }
    const div = refForMouseWheel.current
    div.addEventListener('wheel', onWheel)
    return () => div.removeEventListener('wheel', onWheel)
  }, [size, cropping, onChange])

  return (
    <div
      ref={refForMouseWheel}
      className={`image-cropper ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={cancelDrag}
    >
      <img src={src} alt="" onLoad={onImageLoad} />
      {isLoaded && <ClipRectangle {...cropping.clip} />}
      {isLoaded && <FocusPoint {...cropping.focus} />}
      {!isLoaded && <p>loading image ...</p>}
    </div>
  )
}

const ClipRectangle = ({ x, y, width, height }: Rectangle) => (
  <div className="clip-rectangle">
    <div
      className="clip-line clip-rectangle-shadow"
      style={{
        top: formatAsPercent(y),
        left: formatAsPercent(x),
        bottom: formatAsPercent(1 - y - height),
        right: formatAsPercent(1 - x - width),
      }}
    >
      {/* lines */}
      <div className="clip-line clip-line-vertical" />
      <div className="clip-line clip-line-horizontal" />

      {/* invisible areas with a changed cursor */}
      <div className="clip-border-vertical clip-border-left" data-move-fn="left" />
      <div className="clip-border-vertical clip-border-right" data-move-fn="right" />
      <div className="clip-border-horizontal clip-border-top" data-move-fn="top" />
      <div className="clip-border-horizontal clip-border-bottom" data-move-fn="bottom" />

      {/* drag handles */}
      <div className="clip-handle clip-handle-top-left" data-move-fn="topLeft" />
      <div className="clip-handle clip-handle-top" data-move-fn="top" />
      <div className="clip-handle clip-handle-top-right" data-move-fn="topRight" />
      <div className="clip-handle clip-handle-right" data-move-fn="right" />
      <div className="clip-handle clip-handle-bottom-right" data-move-fn="bottomRight" />
      <div className="clip-handle clip-handle-bottom" data-move-fn="bottom" />
      <div className="clip-handle clip-handle-bottom-left" data-move-fn="bottomLeft" />
      <div className="clip-handle clip-handle-left" data-move-fn="left" />
    </div>
  </div>
)

const FocusPoint = ({ x, y }: Point) => (
  <div
    className="focus-point"
    style={{ top: formatAsPercent(y), left: formatAsPercent(x) }}
    data-move-fn="focus"
  />
)

const formatAsPercent = (v: number) => `${v * 100}%`

const getRelativePoint = (e: React.PointerEvent<HTMLDivElement>): Point => {
  const { x, y, width, height } = e.currentTarget.getBoundingClientRect()
  return {
    x: (e.clientX - x) / width,
    y: (e.clientY - y) / height,
  }
}
