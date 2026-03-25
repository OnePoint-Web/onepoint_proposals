import {createItem} from './factories'
import {arrayMove} from '@dnd-kit/sortable';

const recalcOrder = (list, field) =>
  list.map((item, index) => ({
    ...item,
    [field]: index + 1
  }))

export function itemsReducer(items = [], action) {
  
  switch(action.type) {
    case 'ADD_PRODUCT_ITEM':
      return [...items, createItem()];

    case 'REORDER_PRODUCT_ITEM': {
        const oldIndex = items.findIndex(d => d.id === action.payload.activeId)
        const newIndex = items.findIndex(d => d.id === action.payload.overId)
        if (oldIndex === -1 || newIndex === -1) return items
        const reordered = arrayMove(items, oldIndex, newIndex)
        return recalcOrder(reordered, "display_order")
      }

    case 'UPDATE_PRODUCT_ITEM':
      return items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, ...action.payload.data }
          : item
      )

    case 'DELETE_PRODUCT_ITEM': {
      const filtered = items.filter(d => d.id !== action.payload.itemId)
      return recalcOrder(filtered, "display_order")
    }

    default:
      return items;
  }
}