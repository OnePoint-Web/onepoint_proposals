export const createDeal = () => ({

    id: crypto.randomUUID(),
    item: '',
    item_type: 'Paragraph',
    display_order: null,
    items: [createDealItem()]
            
})

export const createDealItem = () => ({
    id: crypto.randomUUID(),
    entry: '',
    order: null
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

export const createTimelineScope = () => ({
  id: crypto.randomUUID(),
  description: '',
  startDate: '',
  endDate: ''
})

export const createItem = () => ({
    id: crypto.randomUUID(),
    item: '',
    itemPrice: '',
    quantity: 1,
    totalPrice: null,
    discountType: '',
    discountValue: null,
    discountDescription: '',
    discountedTotal: null,
    itemDescription: '',
    displayOrder: null
})

export const createInitialProposal = ({ proposalType, clientType }) => {
 
  const base = {
    id: crypto.randomUUID(),
    clientId: '',
    clientType,
    proposalTitle: '',
    proposalType,
    proposalPackage: '',
    executiveSummary: '',
    goalsAndObjectives: '',
    execVideoUrl: '',
    proposedSolution: '',
    proposalDescription: '',
    discountType: '',
    discountValue: null,
    discountDescription: '',
    taxableAmount: '',
    taxApplicable: true,
    taxRate: 10,
    taxAmount: null,
    taxReason: '',
    finalPrice: null,
    paymentTerms: '',
    selectedTeamMembers: [],
    timelines: [createTimeline()],

    // These fields are for UI only. Will not be passed to database
    subtotal: null, //proposal subtotla/base price (depending if SLA or service/product proposal)
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
      proposalPackage: '',
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