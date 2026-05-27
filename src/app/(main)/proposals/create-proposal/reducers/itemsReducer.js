import {createItem} from './factories'
import {arrayMove} from '@dnd-kit/sortable';

const recalcOrder = (list, field) =>
  list.map((item, index) => ({
    ...item,
    [field]: index + 1
  }))

function roundToTwo(num) {
return Math.round((num + Number.EPSILON) * 100) / 100;
}
  
const calculateTotals = (item) => {
  const price = Number(item.itemPrice) || 0
  const qty = Number(item.quantity) || 0
  const discountType = (item.itemDiscountType || '').trim().toLowerCase()
  const discountValue = Number(item.itemDiscountValue) || 0

  let subtotal = price * qty
  let discountedTotal = subtotal

  if (discountType === 'percentage') {
    discountedTotal = subtotal - (subtotal * (discountValue / 100))
  } else if (discountType === 'fixed') {
    discountedTotal = subtotal - discountValue
  }

  return {
    totalPrice: roundToTwo(subtotal),
    discountedTotal: discountedTotal >= 0 ? roundToTwo(discountedTotal) : 0
  }
}

export function itemsReducer(items = [], action) {
  
  switch(action.type) {
    case 'ADD_PRODUCT_ITEM':
      return [...items, createItem()];

    case 'REORDER_PRODUCT_ITEM': {
        const oldIndex = items.findIndex(d => d.offerEntryId === action.payload.activeId)
        const newIndex = items.findIndex(d => d.offerEntryId === action.payload.overId)
        if (oldIndex === -1 || newIndex === -1) return items
        const reordered = arrayMove(items, oldIndex, newIndex)
        return recalcOrder(reordered, "displayOrder")
      }

    case 'UPDATE_PRODUCT_ITEM':
      return items.map(item => {
        if (item.offerEntryId !== action.payload.itemId) return item

        let updatedItem = { ...item, ...action.payload.data }

        // business rules for discounts
        const type = (updatedItem.itemDiscountType || '').toLowerCase()
        if (type === 'none') updatedItem.itemDiscountValue = 0
        if (type === 'percentage') updatedItem.itemDiscountValue = Math.min(updatedItem.itemDiscountValue || 0, 100)
        if (type === 'fixed') updatedItem.itemDiscountValue = Math.max(updatedItem.itemDiscountValue || 0, 0)

        // calculate totals
        const totals = calculateTotals(updatedItem)

        return { ...updatedItem, ...totals }
    })

    case 'SELECT_SERVICE_PRODUCT_ITEM':
      return items.map(item => {
        if (item.offerEntryId !== action.payload.itemId) return item

        const selected = action.payload.item
        const updatedItem = {
          ...item,
          serviceProductItem: selected.name,
          itemPrice: Number(selected.price) || 0,
          itemDescription: selected.description || item.itemDescription,
          itemImage: selected.image || item.itemImage || '',
        }
        const totals = calculateTotals(updatedItem)

        return { ...updatedItem, ...totals }
      })

    case 'UPDATE_PRODUCT_ITEM_IMAGE':
      return items.map(item => {
        if (item.offerEntryId !== action.payload.itemId) return item
        return {
          ...item,
          itemImage: action.payload.itemImage || '',
        }
      })

    case 'DELETE_PRODUCT_ITEM': {
      const filtered = items.filter(d => d.offerEntryId !== action.payload.itemId)
      return recalcOrder(filtered, "displayOrder")
    }

    default:
      return items;
  }
}
