
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

  // Vimeo — captures optional privacy hash for "anyone with the link" private videos
  // Private URLs: vimeo.com/ID/HASH → embed must include ?h=HASH
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/)
  if (vimeoMatch) {
    const [, id, hash] = vimeoMatch
    const embedUrl = hash
      ? `https://player.vimeo.com/video/${id}?h=${hash}`
      : `https://player.vimeo.com/video/${id}`
    return { type: 'vimeo', id, embedUrl }
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