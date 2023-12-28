import fs from 'fs'
import path from 'path'

export const getFeatureFiles = (dir: string = 'features'): string[] => {
  const files = fs.readdirSync(dir)
  const featureFiles = files.filter((file) => file.endsWith('.feature'))
  return featureFiles
}

export const readFeatureFile = (dir: string, filename: string): string => {
  const filePath = path.join(dir, filename)
  return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

export const writeFeatureFile = (
  content: string,
  dir: string,
  filename: string
) => {
  const filePath = path.join(dir, filename)
  fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
    if (err) {
      return console.error(err)
    }
    fs.writeFile(filePath, content, { encoding: 'utf-8' }, (writeErr) => {
      if (writeErr) {
        console.error(writeErr)
      } else {
        console.log(`The test file is saved as ${filePath}`)
      }
    })
  })
}
