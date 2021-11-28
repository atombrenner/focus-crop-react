import { useState } from 'react'
import './App.css'
import { ImageCropper } from './lib/ImageCropper'
import { Cropping } from './lib/model'

export function App() {
  const [cropping, setCropping] = useState<Cropping>({
    focus: { x: 0.5, y: 1 / 3 },
    clip: { x: 0, y: 0, width: 1, height: 1 },
  })

  return (
    <div className="App">
      <ImageCropper
        className="app-cropper"
        src="pexels-laura-penwell-3608056.webp"
        cropping={cropping}
        onLoad={() => {}}
        onChange={setCropping}
      />
    </div>
  )
}
