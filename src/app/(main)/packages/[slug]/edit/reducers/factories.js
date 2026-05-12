export const createDealEntry = () => ({
    itemEntryId: crypto.randomUUID(),
    itemEntry: '',
    displayOrder: 0,
})

export const createDeal = () => ({
packageDealItemId: crypto.randomUUID(),
    item: '',
    itemType: 'Paragraph',
    displayOrder: 0,
    packageDealEntries: [createDealEntry()]     
})

export const createInitialDeal = () => ([{
    packageDealItemId: crypto.randomUUID(),
    item: '',
    itemType: 'Paragraph',
    displayOrder: 0,
    packageDealEntries: [createDealEntry()]     
}])