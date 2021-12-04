import { useState } from 'react'
import { CroppedImage } from './lib/CroppedImage'
import { ImageCropper } from './lib/ImageCropper'
import { Cropping } from './lib/focusCrop'

import './App.css'

export function App() {
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
      {image && <CroppedImage image={image} ratio="5:2" cropping={cropping} />}
      {image && <CroppedImage image={image} ratio="16:9" cropping={cropping} />}
      {image && <CroppedImage image={image} ratio="1:1" cropping={cropping} />}
      {image && <CroppedImage image={image} ratio="9:16" cropping={cropping} />}
      {image && <CroppedImage image={image} ratio="90:195" cropping={cropping} />}
    </div>
  )
}
