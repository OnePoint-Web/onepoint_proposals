import { z } from 'zod'

const safeNumber = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined

  const num = Number(val)

  return isNaN(num) ? undefined : num
}, z.number())

export const dealItemSchema = z.object({
  itemEntryId: z.string(),
  itemEntry: z.string(),
  displayOrder: safeNumber.optional()
}).refine(
  data => data.entry?.trim() !== '' || data.order != null,
  {
    message: 'Empty deal item',
    path: ['entry'],
  }
)

export const dealSchema = z.object({
  packageDealItemId: z.string(),
  item: z.string(),
  itemType: z.string().optional(),
  displayOrder: safeNumber.optional(),
  packageDealEntries: z.array(dealItemSchema).transform(items =>
    items.filter(item => item.itemEntry?.trim() || item.displayOrder != null)
  )
}).refine(
  data => data.item?.trim() !== '' || (data.packageDealEntries?.length > 0),
  {
    message: 'Empty deal row',
    path: ['item'],
  }
)

export const dealsSchema = z.array(dealSchema).transform(deals =>
  deals.filter(deal => deal.item?.trim() || (deal.packageDealEntries?.length > 0))
)