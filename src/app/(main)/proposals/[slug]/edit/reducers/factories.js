export const createDeal = () => ({
    packageDealItemId: crypto.randomUUID(),
    item: '',
    itemType: 'Paragraph',
    displayOrder: 0,
    _status: 'new',
    packageDealEntries: [createDealEntry()]     
})

export const createDealEntry = () => ({
    itemEntryId: crypto.randomUUID(),
    itemEntry: '',
    displayOrder: 0,
    _status: 'new'
})

export const createTimeline = () => (
    {
        timelineId: crypto.randomUUID(),
        timeFrame: '',
        progress: 0,
        assignedTo: 'OnePoint',
        timelineScopeItems: [createTimelineScope()],
        _status: 'new'
    }
)

export const createTimelineScope = () => ({
  scopeItemId: crypto.randomUUID(),
  scope: '',
  order: 0,
})

export const createItem = () => ({
    offerEntryId: crypto.randomUUID(),
    serviceProductItem: '',
    itemPrice: 0,
    quantity: 1,
    totalPrice: 0,
    discountType: 'None',
    discountValue: 0,
    discountDescription: '',
    discountedTotal: 0,
    itemDescription: '',
    displayOrder: null,
    _status: 'new'
})