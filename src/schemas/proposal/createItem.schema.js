import { z } from 'zod'

const safeNumber = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined

  const num = Number(val)

  return isNaN(num) ? undefined : num
}, z.number())

export const itemSchema = z.object({
  id: z.string().uuid(),
  item: z.string().min(1, 'Provide item name...'),
  itemPrice: safeNumber,
  quantity: safeNumber,
  totalPrice: z.number().optional(),
  discountType: z.enum(['Percentage', 'Fixed', 'None']).optional(),
  discountValue: safeNumber.nullable().optional(),
  discountDescription: z.string().optional(),
  discountedTotal: z.number().optional(),
  itemDescription: z.string().optional(),
  displayOrder: z.number().nullable().optional(),
})
.refine((data) => {
  if (!data.discountType) return true

  if (data.discountType === 'PERCENT') {
    return data.discountValue != null && data.discountValue <= 100
  }

  if (data.discountType === 'FIXED') {
    return data.discountValue != null
  }

  return true
}, {
  message: 'Invalid discount',
  path: ['discountValue'],
})

export const itemsSchema = z
  .array(itemSchema)
  .transform(items =>
    items.filter(item =>
      item.item?.trim() ||
      item.itemPrice ||
      item.quantity > 0
    )
  )