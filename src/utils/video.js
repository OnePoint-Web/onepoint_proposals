
export function parseVideoUrl(url) {
  if (!url) return null

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
  )
  if (ytMatch) {
    return {
      type: 'youtube',
      id: ytMatch[1],
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`
    }
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/.*?(\d+)/)
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
  }

  // Direct file
  if (url.match(/\.(mp4|webm)$/)) {
    return {
      type: 'file',
      embedUrl: url
    }
  }

  return null
}