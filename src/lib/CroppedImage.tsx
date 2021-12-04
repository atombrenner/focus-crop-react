import { useEffect, useRef } from 'react'
import { Size, Cropping, focusCrop } from './focusCrop'
import './CroppedImage.css'

const ratioFromString = (ratio: string) => {
  const [w, h] = ratio.split(':').map(Number)
  if (!(w && h && w > 0 && h > 0)) throw Error(`invalid ratio: ${ratio}`)
  return w / h
}

const calcCanvasSize = (ratio: number): Size => {
  // To make preview images more comparable we try to occupy the same space.
  // So we we try to keep the square pixels constant and
  // because of the vertical-horizontal optical illusion
  // we need to overweight the height in the calculation.
  const target = 200
  const squarePixels = (target + target * 0.07 * ratio) ** 2
  //const squarePixels = target ** 2
  console.log(squarePixels)
  const height = Math.sqrt(squarePixels / ratio)
  const width = height * ratio
  return { width, height }
}

export type CroppedImageProps = {
  image: HTMLImageElement
  ratio: string
  cropping: Cropping
}

export const CroppedImage = ({ image, ratio, cropping }: CroppedImageProps) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const desiredRatio = ratioFromString(ratio)
  const { width, height } = calcCanvasSize(desiredRatio)

  useEffect(() => {
    const ctx = ref.current!.getContext('2d')
    if (!ctx) throw Error('no canvas context')
    const originalSize = { width: image.naturalWidth, height: image.naturalHeight }
    const src = focusCrop(desiredRatio, originalSize, cropping)
    ctx.drawImage(image, src.x, src.y, src.width, src.height, 0, 0, width, height)
  })

  return (
    <div className="cropped-image">
      <canvas ref={ref} width={width} height={height} />
      <div className="cropped-image-label">{ratio}</div>
    </div>
  )
}