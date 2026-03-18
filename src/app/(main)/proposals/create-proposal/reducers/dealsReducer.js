import {arrayMove} from '@dnd-kit/sortable';
import {createDeal, createDealItem} from './factories'

const recalcOrder = (list, field) =>
  list.map((item, index) => ({
    ...item,
    [field]: index + 1
  }))


export const dealsReducer = (deals, action) => {
  switch (action.type) {

    case 'ADD_DEAL': {
      const updated = [...deals, createDeal()]
       return recalcOrder(updated, "display_order")
    }
        

    case 'REORDER_DEALS': {
      const oldIndex = deals.findIndex(d => d.id === action.payload.activeId)
      const newIndex = deals.findIndex(d => d.id === action.payload.overId)
      if (oldIndex === -1 || newIndex === -1) return deals
      const reordered = arrayMove(deals, oldIndex, newIndex)
      return recalcOrder(reordered, "display_order")
    }

    case 'UPDATE_DEAL':
      return deals.map(deal =>
        deal.id === action.payload.dealId
          ? { ...deal, ...action.payload.data }
          : deal
      )

    case 'ADD_ITEM':
      return deals.map(deal =>
        deal.id === action.payload.dealId
          ? { ...deal, items: recalcOrder([...deal.items, createDealItem()], "order") }
          : deal
      )

    case 'UPDATE_ITEM':
      return deals.map(deal =>
        deal.id === action.payload.dealId
          ? {
              ...deal,
              items: deal.items.map(item =>
                item.id === action.payload.itemId
                  ? { ...item, ...action.payload.data }
                  : item
              )
            }
          : deal
      )

    case 'REORDER_ITEMS': {
      const { dealId, activeId, overId } = action.payload
      return deals.map(deal => {
        if (deal.id !== dealId) return deal

        const oldIndex = deal.items.findIndex(i => i.id === activeId)
        const newIndex = deal.items.findIndex(i => i.id === overId)
        if (oldIndex === -1 || newIndex === -1) return deal

        const reorderedItems = arrayMove(deal.items, oldIndex, newIndex)
        return { ...deal, items: recalcOrder(reorderedItems, "order") }
      })
    }

    case 'DELETE_DEAL': {
      const filtered = deals.filter(d => d.id !== action.payload.dealId)
      return recalcOrder(filtered, "display_order")
    }

    case 'DELETE_ITEM':
    return deals.map(deal =>
      deal.id === action.payload.dealId
        ? { ...deal, items: recalcOrder(deal.items.filter(i => i.id !== action.payload.itemId), "order") }
        : deal
    )

    default:
      return deals
  }
}
    

