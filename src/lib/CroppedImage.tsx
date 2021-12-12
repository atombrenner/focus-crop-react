import { useEffect, useRef } from 'react'
import { Size, Cropping, focusCrop, ratioFromString } from './focusCrop'
import './CroppedImage.css'

const calcCanvasSize = (ratio: number, target = 160): Size => {
  // To make preview images more comparable we try to occupy the same space.
  // So we we try to keep the square pixels constant and
  // because of the vertical-horizontal optical illusion
  // we need to overweight the height in the calculation.
  const squarePixels = (target + target * 0.07 * ratio) ** 2
  //const squarePixels = target ** 2
  //console.log(squarePixels)
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
  const { width, height } = calcCanvasSize(desiredRatio, image.width / 3)

  useEffect(() => {
    const ctx = ref.current!.getContext('2d')
    if (!ctx) throw Error('no canvas context')
    const src = focusCrop(desiredRatio, cropping)
    ctx.drawImage(image, src.x, src.y, src.width, src.height, 0, 0, width, height)
  })

  return (
    <div className="cropped-image">
      <canvas ref={ref} width={width} height={height} />
      <div className="cropped-image-label">{ratio}</div>
    </div>
  )
}
