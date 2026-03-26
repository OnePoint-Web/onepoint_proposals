import {createItem} from './factories'
import {arrayMove} from '@dnd-kit/sortable';

const recalcOrder = (list, field) =>
  list.map((item, index) => ({
    ...item,
    [field]: index + 1
  }))

const calculateTotals = (item) => {
  const price = Number(item.itemPrice) || 0
  const qty = Number(item.quantity) || 0
  const discountType = (item.discountType || '').trim().toLowerCase()
  const discountValue = Number(item.discountValue) || 0

  let subtotal = price * qty
  let discountedTotal = subtotal

  if (discountType === 'percentage') {
    discountedTotal = subtotal - (subtotal * (discountValue / 100))
  } else if (discountType === 'fixed') {
    discountedTotal = subtotal - discountValue
  }

  return {
    totalPrice: subtotal,
    discountedTotal: discountedTotal >= 0 ? discountedTotal : 0
  }
}

export function itemsReducer(items = [], action) {
  
  switch(action.type) {
    case 'ADD_PRODUCT_ITEM':
      return [...items, createItem()];

    case 'REORDER_PRODUCT_ITEM': {
        const oldIndex = items.findIndex(d => d.id === action.payload.activeId)
        const newIndex = items.findIndex(d => d.id === action.payload.overId)
        if (oldIndex === -1 || newIndex === -1) return items
        const reordered = arrayMove(items, oldIndex, newIndex)
        return recalcOrder(reordered, "displayOrder")
      }

    case 'UPDATE_PRODUCT_ITEM':
      return items.map(item => {
        if (item.id !== action.payload.itemId) return item

        const updatedItem = {
          ...item,
          ...action.payload.data
        }

        const totals = calculateTotals(updatedItem)

        return {
          ...updatedItem,
          ...totals
        }
    })

    case 'DELETE_PRODUCT_ITEM': {
      const filtered = items.filter(d => d.id !== action.payload.itemId)
      return recalcOrder(filtered, "displayOrder")
    }

    default:
      return items;
  }
}