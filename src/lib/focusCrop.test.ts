import { Cropping, focusCrop, ratioFromString } from './focusCrop'

const cropping: Cropping = {
  focus: { x: 400, y: 300 },
  clip: { x: 34, y: 37, width: 841, height: 759 },
}

const ratios = ['5:2', '16:9', '4:3', '1:1', '9:16', '90:195']

test.each(ratios)('ratio %s generates a valid rectangle', (ratio) => {
  const desiredRatio = ratioFromString(ratio)
  const rect = focusCrop(desiredRatio, cropping)
  expect(rect.width / rect.height).toBeCloseTo(desiredRatio)
  expect(rect).toMatchSnapshot()
})
