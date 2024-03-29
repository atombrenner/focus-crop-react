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
  'pexels-dominika-roseclay-1094794.webp',
  'pexels-kasia-palitava-10391201.webp',
  'pexels-emma-li-5199173.webp',
  'pexels-evie-shaffer-2512387.webp',
  'tansparent.png',
] as const

const defaultCropping: Cropping = {
  focus: { x: 0.5, y: 1 / 3 },
  clip: { x: 0, y: 0, width: 1, height: 1 },
}

export const App = () => {
  const [example, setExample] = useState<string>(examples[0])
  const [image, setImage] = useState<HTMLImageElement>()
  const [cropping, setCropping] = useState<Cropping>(defaultCropping)

  const onSelectExample = (example: string) => {
    setCropping(defaultCropping)
    setExample(example)
    setImage(undefined)
  }

  return (
    <>
      <h1>Focus Crop React</h1>
      <p>
        React components for cropping images around a focus point to the desired aspect ratio.{' '}
        <a href="https://github.com/atombrenner/focus-crop-react">GitHub Repo</a>
      </p>
      <div className="app-layout">
        <div className="app-cropper">
          <ImageCropper
            src={PUBLIC_URL + example}
            cropping={cropping}
            onLoad={setImage}
            onChange={setCropping}
          />
          <p>
            1. Click inside the above image to set the focus point. The focus point marks the most
            important area. You can always drag it to a new position later.
          </p>
          <p>
            2. Drag the image border to the inside to hide unwanted parts. Alternatively, use the
            mouse wheel zoom by cutting from all four borders.
          </p>
          <p>
            More example images from <a href="https://pexels.com">Pexels</a>:
          </p>
          <Examples selected={example} examples={examples} onSelect={onSelectExample} />
        </div>
        <CroppedImages key={example} image={image} cropping={cropping} />
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
        key={e}
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
