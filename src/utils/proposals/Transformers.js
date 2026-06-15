export const prepareProposalItemsForSubmit = (type, itemState) => {
         if(type === 'DEALS'){
        return itemState.map((deal, dealIndex) => ({
                ...deal,
                displayOrder: dealIndex + 1,
                packageDealEntries: deal.packageDealEntries.map((item, itemIndex) => ({
                    ...item,
                    displayOrder: itemIndex + 1
                    })) 
                }));
            } else if(type === 'ITEMS') {
                return itemState.map((item, itemIndex) => ({
                    ...item,
                    displayOrder: itemIndex + 1
                }));
            }
        }

export const cleanDeals = (dealsState) => {

        return dealsState
    .map(deal => ({
        ...deal,
        item: deal.item?.trim(),
        packageDealEntries: (deal.packageDealEntries || [])
            .map(item => ({
                ...item,
                itemEntry: item.itemEntry?.trim()
            }))
            .filter(item => item.itemEntry) // remove empty entries
    }))
    .filter(deal => 
        deal.item && deal.packageDealEntries.length > 0 // remove empty deals
    )
}

export const cleanItems = (itemsState) => {
    return itemsState
        .map(item => ({
            ...item,
            item: item.serviceProductItem?.trim(),
            description: item.itemDescription?.trim() || '',
            itemImage: item.itemImage || '',
            itemPrice: Number(item.itemPrice) ?? 0,
            quantity: Number(item.quantity),
            itemDiscountValue: Number(item.itemDiscountValue) ?? 0
        })
        )
        .filter(item => item.item)
}

export const cleanTimelines = (timelinesState) => {
    return timelinesState
        .map(timeline => ({
            ...timeline,
            timeFrame: timeline.timeFrame?.trim(),
            progress: Number(timeline.progress),
            assignedTo: timeline.assignedTo?.trim(),
            timelineScopeItems: (timeline.timelineScopeItems?.length ?? 0) > 0
            ? {
                create: timeline.timelineScopeItems.map(s => ({
                scope: s.scope
                })).filter(scope => scope.scope)
            }
            : undefined
        })).filter(timeline => timeline.timeFrame)
}

const buildProposalDealsPayload = (parsedResult) => {

    const cleanedDeals = parsedResult.data.deals;

    const dealItemsPayload = prepareProposalItemsForSubmit('DEALS', cleanedDeals).map(deal => ({
        item: deal.item,
        itemType: deal.itemType,
        displayOrder: deal.displayOrder,
        packageDealEntries: deal.packageDealEntries.length > 0
            ? {
                create: deal.packageDealEntries.map(item => ({
                    itemEntry: item.itemEntry,
                    displayOrder: item.displayOrder
                }))
            }
            : {}
    }))

    return dealItemsPayload
}


const buildProposalOffersPayload = (parsedResult) => {

    const cleanedItems = parsedResult.data.items
    
    const offerEntriesPayload = prepareProposalItemsForSubmit('ITEMS', cleanedItems).map(item => ({
        serviceProductItem: item.item,
        itemPrice: item.itemPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        itemDiscountType: item.itemDiscountType,
        itemDiscountValue: item.itemDiscountValue,
        itemDiscountDescription: item.itemDiscountDescription,
        description: item.description,
        itemImage: item.itemImage || null,
        displayOrder: item.displayOrder,
        isSelected: item.isSelected ?? true,
    }))

    return offerEntriesPayload
}

const buildSlaOfferPayload = (parsedResult) => {
    
    const proposalSubData = {
        slaPackage: parsedResult.data.slaPackage,
        basePrice: parsedResult.data.basePrice,
        discountType: parsedResult.data.discountType,
        discountValue: parsedResult.data.discountValue,
        discountDescription: parsedResult.data.discountDescription,
        taxableAmount: parsedResult.data.taxableAmount,
        taxApplicable: parsedResult.data.taxApplicable,
        taxRate: parsedResult.data.taxRate,
        taxAmount: parsedResult.data.taxAmount,
        taxReason: parsedResult.data.taxReason,
        finalPrice: parsedResult.data.finalPrice,
        paymentTerms: parsedResult.data.paymentTerms,
        packageDealItem: {
            create: buildProposalDealsPayload(parsedResult)
        }
    }

    return proposalSubData
}

const buildServiceOfferPayload = (parsedResult) => {
    
    const proposalSubData = {
        type: parsedResult.data.proposalType,
        isMultipleChoice: parsedResult.data.isMultipleChoice,
        subTotal: parsedResult.data.subtotal,
        discountType: parsedResult.data.discountType,
        discountValue: parsedResult.data.discountValue,
        discountDescription: parsedResult.data.discountDescription,
        taxableAmount: parsedResult.data.taxableAmount,
        taxApplicable: parsedResult.data.taxApplicable,
        taxRate: parsedResult.data.taxRate,
        taxAmount: parsedResult.data.taxAmount,
        taxReason: parsedResult.data.taxReason,
        finalPrice: parsedResult.data.finalPrice,
        paymentTerms: parsedResult.data.paymentTerms,
        offerEntries: {
            create: buildProposalOffersPayload(parsedResult)
        }
    }

    return proposalSubData
}


export const buildProposalPayload = (proposalState, parsedResult ) => {
        
            const baseData = {
                slaPackage: parsedResult.data.slaPackage,
                clientId: parsedResult.data.clientId,
                clientType: parsedResult.data.clientType,
                proposalTitle: parsedResult.data.proposalTitle,
                proposalType: parsedResult.data.proposalType,
                executiveSummary: parsedResult.data.executiveSummary,
                goalsAndObjectives: parsedResult.data.goalsAndObjectives,
                execVideoUrl: parsedResult.data.execVideoUrl,
                proposedSolution: parsedResult.data.proposedSolution,
                proposalDescription: parsedResult.data.proposalDescription,
                isMultipleChoice: parsedResult.data.isMultipleChoice,
            }
            const payload = proposalState.proposalType === 'SLA Proposal' ? 
            {
                ...baseData,
                timelines: parsedResult.data.timelines,
                slaOffers: buildSlaOfferPayload(parsedResult),
                selectedMembers: parsedResult.data.selectedMembers
                
                
            } :
            {
                ...baseData,
                timelines: parsedResult.data.timelines,
                serviceProductOffers: buildServiceOfferPayload(parsedResult),
                selectedMembers: parsedResult.data.selectedMembers
                
            }

            return payload
}
