import { useState } from 'react'
import { CroppedImage } from './lib/CroppedImage'
import { ImageCropper } from './lib/ImageCropper'
import { Cropping, scaleCropping } from './lib/focusCrop'

import './App.css'

const PUBLIC_URL = process.env.PUBLIC_URL + '/'

const examples = [
  'pexels-cottonbro-4503273.webp',
  'pexels-laura-penwell-3608056.webp',
  'pexels-vlada-karpovich-4609096.webp',
  'pexels-kyle-karbowski-9637308.webp',
] as const

export const App = () => {
  const [example, setExample] = useState<string>(examples[0])
  const [image, setImage] = useState<HTMLImageElement>()
  const [cropping, setCropping] = useState<Cropping>({
    focus: { x: 0.5, y: 1 / 3 },
    clip: { x: 0, y: 0, width: 1, height: 1 },
  })

  return (
    <>
      <h1>Focus Crop React</h1>
      <p>Crop images to a desired aspect ratio around a focus point.</p>
      <div className="app-layout">
        <div className="app-cropper">
          <ImageCropper
            src={PUBLIC_URL + example}
            cropping={cropping}
            onLoad={setImage}
            onChange={setCropping}
          />
          <p>
            Example images from <a href="https://pexels.com">Pexels</a>:
          </p>
          <Examples selected={example} examples={examples} onSelect={setExample} />
        </div>
        <CroppedImages image={image} cropping={cropping} />
      </div>
    </>
  )
}

type ExampleProps = Readonly<{
  selected: string
  examples: ReadonlyArray<string>
  onSelect: (example: string) => void
}>
const Examples = ({ selected, examples, onSelect }: ExampleProps) => (
  <div className="app-examples">
    {examples.map((e) => (
      <img
        src={PUBLIC_URL + e}
        alt=""
        className={e === selected ? 'selected' : ''}
        onClick={() => onSelect(e)}
      />
    ))}
  </div>
)

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

  return (
    <div className="app-cropped-images">
      <CroppedImage image={image} ratio="5:2" cropping={scaledCropping} />
      <CroppedImage image={image} ratio="16:9" cropping={scaledCropping} />
      <CroppedImage image={image} ratio="4:3" cropping={scaledCropping} />
      <CroppedImage image={image} ratio="9:16" cropping={scaledCropping} />
      <CroppedImage image={image} ratio="90:195" cropping={scaledCropping} />
    </div>
  )
}
