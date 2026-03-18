export const createDeal = () => ({

    id: crypto.randomUUID(),
    item: '',
    item_type: '',
    display_order: null,
    items: [createDealItem()]
            
})

export const createTimeline = () => (
    {
        id: crypto.randomUUID(),
        timeframe: '',
        progress: '',
        assigned_to: '',
        scopes: [createTimelineScope()]
    }
)

export const createDealItem = () => ({
    id: crypto.randomUUID(),
    entry: '',
    order: null
})

export const createTimelineScope = () => ({
  id: crypto.randomUUID(),
  description: '',
  startDate: '',
  endDate: ''
})