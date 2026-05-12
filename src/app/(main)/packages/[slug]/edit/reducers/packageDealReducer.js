import {arrayMove} from '@dnd-kit/sortable';
import {createDeal, createDealEntry, createInitialDeal} from './factories'

const recalcOrder = (list, field) =>
  list.map((item, index) => ({
    ...item,
    [field]: index + 1
  }))


export const dealsReducer = (deals, action) => {
  switch (action.type) {

    case 'INITIALIZE': {
        const dealsPayload = action.payload;

        const dealsState = dealsPayload ? dealsPayload : createInitialDeal()

        return dealsState
    }

    case 'ADD_DEAL': {
      const updated = [...deals, createDeal()]
       return recalcOrder(updated, "displayOrder")
    }

    case 'REORDER_DEALS': {
      const oldIndex = deals.findIndex(d => d.packageDealItemId === action.payload.activeId)
      const newIndex = deals.findIndex(d => d.packageDealItemId === action.payload.overId)
      if (oldIndex === -1 || newIndex === -1) return deals
      const reordered = arrayMove(deals, oldIndex, newIndex)
      return recalcOrder(reordered, "displayOrder")
    }

    case 'UPDATE_DEAL':
      return deals.map(deal =>
        deal.packageDealItemId === action.payload.dealId
          ? { ...deal, ...action.payload.data }
          : deal
      )

    case 'ADD_ITEM':
      return deals.map(deal =>
        deal.packageDealItemId === action.payload.dealId
          ? { ...deal, packageDealEntries: recalcOrder([...deal.packageDealEntries, createDealEntry()], "displayOrder") }
          : deal
      )

    case 'UPDATE_ITEM':
      return deals.map(deal =>
        deal.packageDealItemId === action.payload.dealId
          ? {
              ...deal,
              packageDealEntries: deal.packageDealEntries.map(item =>
                item.itemEntryId === action.payload.itemId
                  ? { ...item, ...action.payload.data }
                  : item
              )
            }
          : deal
      )

    case 'REORDER_ITEMS': {
      const { dealId, activeId, overId } = action.payload
      return deals.map(deal => {
        if (deal.packageDealItemId !== dealId) return deal

        const oldIndex = deal.packageDealEntries.findIndex(i => i.itemEntryId === activeId)
        const newIndex = deal.packageDealEntries.findIndex(i => i.itemEntryId === overId)
        if (oldIndex === -1 || newIndex === -1) return deal

        const reorderedItems = arrayMove(deal.packageDealEntries, oldIndex, newIndex)
        return { ...deal, packageDealEntries: recalcOrder(reorderedItems, "displayOrder") }
      })
    }

    case 'DELETE_DEAL': {
      const filtered = deals.filter(d => d.packageDealItemId !== action.payload.dealId)
      return filtered.length === 0 ? createInitialDeal() : recalcOrder(filtered, "displayOrder")
    }

    case 'DELETE_ITEM':
    return deals.map(deal =>
      deal.packageDealItemId === action.payload.dealId
        ? { ...deal, packageDealEntries: recalcOrder(deal.packageDealEntries.filter(i => i.itemEntryId !== action.payload.itemId), "displayOrder") }
        : deal
    )

    default:
      return deals
  }
}
    

