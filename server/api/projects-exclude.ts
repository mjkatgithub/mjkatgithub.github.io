import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(() => {
  try {
    const filePath = join(process.cwd(), '.projects-exclude.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // Wenn die Datei nicht existiert, gebe leeres Array zurück
    return []
  }
})
