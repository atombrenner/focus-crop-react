import { useState } from 'react'
import { CroppedImage } from './lib/CroppedImage'
import { ImageCropper } from './lib/ImageCropper'
import { Cropping, scaleCropping } from './lib/focusCrop'

import './App.css'

export const App = () => {
  const [image, setImage] = useState<HTMLImageElement>()
  const [cropping, setCropping] = useState<Cropping>({
    focus: { x: 0.5, y: 1 / 3 },
    clip: { x: 0, y: 0, width: 1, height: 1 },
  })

  return (
    <div className="App">
      <ImageCropper
        className="app-cropper"
        //src="pexels-laura-penwell-3608056.webp"
        src="pexels-cottonbro-4503273.webp"
        cropping={cropping}
        onLoad={setImage}
        onChange={setCropping}
      />
      <CroppedImages image={image} cropping={cropping} />
    </div>
  )
}

export type CroppedImagesProps = {
  image?: HTMLImageElement
  cropping: Cropping
}

export const CroppedImages = ({ image, cropping }: CroppedImagesProps) => {
  if (!image) return null

  const scaledCropping = scaleCropping(cropping, {
    width: image.naturalWidth,
    height: image.naturalHeight,
  })

  console.log(scaledCropping)

  return (
    <div>
      <CroppedImage image={image} ratio="5:2" cropping={scaledCropping} />
      <CroppedImage image={image} ratio="16:9" cropping={scaledCropping} />
      <CroppedImage image={image} ratio="1:1" cropping={scaledCropping} />
      <CroppedImage image={image} ratio="9:16" cropping={scaledCropping} />
      <CroppedImage image={image} ratio="90:195" cropping={scaledCropping} />
    </div>
  )
}
