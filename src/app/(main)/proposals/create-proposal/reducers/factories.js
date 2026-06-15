export const createDeal = () => ({

    packageDealItemId: crypto.randomUUID(),
    item: '',
    itemType: 'Paragraph',
    displayOrder: 0,
    packageDealEntries: [createDealItem()]
   
            
})

export const createDealItem = () => ({
    itemEntryId: crypto.randomUUID(),
    itemEntry: '',
    displayOrder: 0
})

export const createTimeline = () => (
    {
        timelineId: crypto.randomUUID(),
        timeFrame: '',
        progress: 0,
        assignedTo: 'OnePoint',
        timelineScopeItems: [createTimelineScope()]
    }
)

export const createTimelineScope = () => ({
  scopeItemId: crypto.randomUUID(),
  scope: '',
})

export const createItem = () => ({
    offerEntryId: crypto.randomUUID(),
    serviceProductItem: '',
    itemPrice: 0,
    quantity: 1,
    totalPrice: 0,
    itemDiscountType: 'None',
    itemDiscountValue: 0,
    itemDiscountDescription: '',
    discountedTotal: 0,
    itemDescription: '',
    itemImage: '',
    displayOrder: null,
    isSelected: true,
})

export const createInitialProposal = ({ proposalType, clientType }) => {
 
  const base = {
    id: crypto.randomUUID(),
    clientId: null,
    clientType,
    proposalTitle: '',
    proposalType,
    executiveSummary: '',
    goalsAndObjectives: '',
    execVideoUrl: '',
    proposedSolution: '',
    proposalDescription: '',
    timelines: [createTimeline()],
    selectedMembers: [],

    //if SLA Offer
    //slaPackage
    //basePrice
    discountType: 'None',
    discountValue: 0,
    discountDescription: '',
    taxableAmount: '',
    taxApplicable: true,
    taxRate: 10,
    taxAmount: 0,
    taxReason: '',
    finalPrice: 0,
    paymentTerms: '',
    taxableAmount: 0,
    
    
    // for service product proposal
    subtotal: null, 
    isMultipleChoice: false,
    // These fields are for UI only. Will not be passed to database
    //proposal subtotla/base price (depending if SLA or service/product proposal)
    totalItemDiscount: null, //total APPLIED discount, not total discount amount
    baseAmount: null, //base amount of SLA proposal/ base total price of items in service/product proposal
    globalDiscountAmount: null, //applied global discount amount 
    totalEnteredItemDiscount: null, //the total entered item discount amount 
    totalEnteredGlobalDiscount: null, //total entered global discount amount
    totalDiscountAmount: null,
    totalAppliedDiscount: null,
    validationErrors: {}
  };

  if (proposalType === 'SLA Proposal') {
    return {
      ...base,
      slaPackage: 'Custom Package',
      basePrice: 0,
      deals: [createDeal()],
    };
  }

  if (
    proposalType === 'Product Proposal' ||
    proposalType === 'Service Proposal'
  ) {
    return {
      ...base,
      isMultipleChoice: false,
      items: [createItem()],
    };
  }

  return base;
}
