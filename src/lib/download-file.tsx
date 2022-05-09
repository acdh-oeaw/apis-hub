export function downloadFile(content: string, mimeType: string, fileName: string): void {
  const blob = new Blob([content], { type: mimeType })
  const objectUrl = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.setAttribute('download', fileName)
  anchor.setAttribute('href', objectUrl)
  anchor.click()

  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}
