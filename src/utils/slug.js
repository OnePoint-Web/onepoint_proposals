import { prisma } from '@/lib/prisma'

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function generateUniqueSlug(model, title) {
  const baseSlug = slugify(title)
  let slug = baseSlug
  let count = 1

  while (true) {
    let existing

    if (model === 'package') {
      existing = await prisma.package.findUnique({ where: { slug } })
    }

    if (model === 'proposal') {
      existing = await prisma.proposal.findUnique({ where: { slug } })
    }

    if (!existing) break

    slug = `${baseSlug}-${count}`
    count++
  }

  return slug
}