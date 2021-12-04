import { Cropping, focusCrop, Size } from './focusCrop'

const imageSize: Size = { width: 800, height: 600 }
const cropping: Cropping = {
  focus: { x: 0.4, y: 0.3 },
  clip: { x: 0.1, y: 0, width: 0.9, height: 0.8 },
}

const ratios = [5 / 2, 16 / 9, 4 / 3, 1 / 1, 9 / 16, 90 / 195]

test.each(ratios)('each desired ratio generates a valid rectangle', (ratio) => {
  const rect = focusCrop(ratio, imageSize, cropping)
  expect(rect.width / rect.height).toBeCloseTo(ratio)
  expect(rect).toMatchSnapshot()
})
