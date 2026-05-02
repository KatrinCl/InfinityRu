export const getImageSrc = (backendUrl: string, img?: string | null) => {
  if (!img) return ''

  // Cloudinary returns full https://... URLs
  if (img.startsWith('http://') || img.startsWith('https://')) return img

  const normalizedBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl

  // Old local uploads are usually stored as /uploads/<file>
  if (img.startsWith('/')) return `${normalizedBackendUrl}${img}`

  return `${normalizedBackendUrl}/${img}`
}

