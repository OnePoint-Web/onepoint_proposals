import {calculateProposalPricing} from '@/modules/pricing/calculateProposalPricing'
import { dealsReducer } from './editDealsReducer'

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
})

export const createItem = () => ({
    id: crypto.randomUUID(),
    item: '',
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

export function editProposalReducer(state, action){
    switch(action.type) {

        case 'INITIALIZE': {
             return action.payload;
        }

        case 'SELECT_PACKAGE': {

            const pkg = action.payload;

            if(!pkg){
                const pricing =  calculateProposalPricing({
                    proposalType: state.proposalType,
                    discountType: state.offer.discountType,
                    discountValue: state.offer.discountValue,
                    taxApplicable: state.offer.taxApplicable,
                    taxRate: state.offer.taxRate,
                    basePrice: 0,
                })

                const newState = {
                    ...state,
                    proposalDescription:'',
                    proposedSolution: '',
                    offer: {
                        ...state.offer,
                        slaPackage: 'Custom Package',
                        packageDealItem: [createDeal()],
                        ...pricing
                    }
                }

                return newState;
            }

            const pricing =  calculateProposalPricing({
                proposalType: state.proposalType,
                discountType: state.offer.discountType,
                discountValue: state.offer.discountValue,
                taxApplicable: state.offer.taxApplicable,
                taxRate: state.offer.taxRate,
                basePrice: pkg.basePrice,
            })

            const newState = {
                ...state,
                proposalDescription: pkg.proposalDescription,
                proposedSolution: pkg.proposedSolution ,
                offer: {
                    ...state.offer,
                    slaPackage: pkg.slaPackage,
                    packageDealItem: pkg.dealItems.map(i => ({
                        packageDealItemId: crypto.randomUUID(),
                        item: i.item,
                        itemType: i.itemType,
                        displayOrder: i.displayOrder,
                        _status: 'new',
                        packageDealEntries: i.dealEntries.map(e => ({
                            itemEntryId: crypto.randomUUID(),
                            itemEntry: e.itemEntry,
                            displayOrder: e.displayOrder,
                            _status: 'new'
                        }))

                    })
                    ),
                    ...pricing
                }
            }
            return newState;
        }

        case 'UPDATE_PROPOSAL_TITLE': {
            
            const newState = {
                ...state,
                proposalTitle: action.payload,
            }

            return newState;
        }

        case 'UPDATE_PRICING_FIELD': {
        const payload = action.payload;

        const updatedOffer = {
            ...state.offer,
            ...payload
        }

        const pricingInputs = [
            'basePrice',
            'discountType',
            'discountValue',
            'taxApplicable',
            'taxRate'
        ]

        const needsPricing = pricingInputs.some(k => k in payload)

            let offerWithPricing = updatedOffer

            if (needsPricing) {
                const pricing = calculateProposalPricing({
                proposalType: state.proposalType,
                items: updatedOffer.offerEntries ?? [],
                discountType: updatedOffer.discountType,
                discountValue: updatedOffer.discountValue,
                taxApplicable: updatedOffer.taxApplicable,
                taxRate: updatedOffer.taxRate,
                basePrice: updatedOffer.basePrice,
                })

                offerWithPricing = {
                ...updatedOffer,
                ...pricing
                }
            }

            return {
                ...state,
                offer: offerWithPricing
            }
        }

        default:{
            const isItemProposal =
              state.proposalType === 'Product Proposal' ||
              state.proposalType === 'Service Proposal'
        
              const isSLA = state.proposalType === 'SLA Proposal'
        
              const updatedItems = isItemProposal
                ? itemsReducer(state.offer.offerEntries || [], action)
                : undefined
        
              const updatedDeals = isSLA
                ? dealsReducer(state.offer.packageDealItem || [], action)
                : undefined
        
              const newState = {
                ...state,
                offer: {
                ...state.offer,
                 ...(isSLA && { packageDealItem: updatedDeals }),
                ...(isItemProposal && { offerEntries: updatedItems }),
               
                },
                // timelines: timelineReducer(state.timelines, action),
              }
        
              const needsPricingUpdate =
                (isItemProposal && updatedItems !== state.offer.offerEntries) ||
                newState.offer.basePrice !== state.offer.basePrice
        
              if (needsPricingUpdate) {
                return { ...newState,  offer: {...newState.offer, ...calculateProposalPricing({
                    proposalType: state.proposalType,
                    items: newState.offer.offerEntries ?? [],
                    discountType: newState.offer.discountType,
                    discountValue: newState.offer.discountValue,
                    taxApplicable: newState.offer.taxApplicable,
                    taxRate: newState.offer.taxRate,
                    basePrice: newState.offer.basePrice,
                })} }
              }
        
              return newState
        }
    }
}