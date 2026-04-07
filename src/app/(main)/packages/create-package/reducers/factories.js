export const createDealItem = () => ({
    id: crypto.randomUUID(),
    entry: '',
    order: null
})

export const createDeal = () => ({

    id: crypto.randomUUID(),
    item: '',
    item_type: 'Paragraph',
    display_order: null,
    items: [createDealItem()]
            
})

export const createInitialDeal = () => ([{
    id: crypto.randomUUID(),
    item: '',
    item_type: 'Paragraph',
    display_order: null,
    items: [createDealItem()]
}])