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

export const createItem = () => ({
    id: crypto.randomUUID(),
    item: '',
    itemImageUR: '',
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
    executiveSummary: '',
    goalsAndObjectives: '',
    execVideoUrl: '',
    proposedSolution: '',
    proposalDescription: '',
    discountType: '',
    discountValue: null,
    discountDescription: '',
    taxableAmount: '',
    taxApplicable: '',
    taxRate: '',
    taxAmount: '',
    taxReason: '',
    finalPrice: null,
    paymentTerms: '',
    timelines: [createTimeline()],

    // These fields are for UI only. Will not be passed to database
    subtotal: null,
    totalItemDiscount: null,
    baseAmount: null,
    globalDiscountAmount: null,
  };

  if (proposalType === 'SLA Proposal') {
    return {
      ...base,
      selectedPackage: '',
      basePrice: null,
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