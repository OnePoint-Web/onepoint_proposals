import { z } from 'zod'

const safeNumber = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined

  const num = Number(val)

  return isNaN(num) ? undefined : num
}, z.number())

export const dealItemSchema = z.object({
  id: z.string(),
  entry: z.string(),
  order: safeNumber.optional()
}).refine(
  data => data.entry?.trim() !== '' || data.order != null,
  {
    message: 'Empty deal item',
    path: ['entry'],
  }
)

export const dealSchema = z.object({
  id: z.string(),
  item: z.string(),
  item_type: z.string().optional(),
  display_order: safeNumber.optional(),
  items: z.array(dealItemSchema).transform(items =>
    items.filter(item => item.entry?.trim() || item.order != null)
  )
}).refine(
  data => data.item?.trim() !== '' || (data.items?.length > 0),
  {
    message: 'Empty deal row',
    path: ['item'],
  }
)

export const dealsSchema = z.array(dealSchema).transform(deals =>
  deals.filter(deal => deal.item?.trim() || (deal.items?.length > 0))
)