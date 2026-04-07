import { z } from 'zod'

const stripHtml = (html) => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

const safeNumber = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined

  const num = Number(val)
  return isNaN(num) ? undefined : num
}, z.number().optional())

export const createPackageSchema = z.object({
  package: z.string().min(1, { message: 'Package title is required' }),
  description: z.string().optional(),
  price: safeNumber,
  solution: z.preprocess((val) => {
    if (!val) return undefined

    const stripped = stripHtml(val)
    return stripped.length === 0 ? undefined : val
  }, z.string().optional()),
  deals: z.object({
    create: z.array(
      z.object({
        dealItem: z.string(),
        itemType: z.string(),
        displayOrder: z.number().nullable(),
        dealEntries: z.object({
          create: z.array(
            z.object({
              itemEntry: z.string(),
              displayOrder: z.number().nullable()
            })
          )
        })
      })
    )
  }).optional()
})