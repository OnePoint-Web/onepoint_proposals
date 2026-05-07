import {calculateProposalPricing} from '@/modules/pricing/calculateProposalPricing'
import { dealsReducer } from './editDealsReducer'
import {itemsReducer} from './editItemReducer'
import {timelinesReducer} from  './editTimelineReducer'
import {calculateTotals} from './editItemReducer'
import {createDeal} from './factories.js'


export function editProposalReducer(state, action){
    switch(action.type) {

        case 'INITIALIZE': {
             const payloadState = action.payload;

             const pricing = calculateProposalPricing({
                proposalType: payloadState.proposalType,
                items: payloadState.offer.offerEntries,
                discountType: payloadState.offer.discountType,
                discountValue: payloadState.offer.discountValue,
                taxApplicable: payloadState.offer.taxApplicable,
                taxRate: payloadState.offer.taxRate,
                basePrice: payloadState.offer.basePrice,
             })

             const initialState = {
                ...payloadState,
                offer: {
                    ...payloadState.offer,
                    ...pricing,
                    offerEntries: (payloadState.offer.offerEntries ?? []).map(e => ({
                        ...e,
                        ...calculateTotals(e)
                    }))
                }
             }

             return initialState
        }

        case 'SET_CLIENT_TYPE': {
            
            const payload = action.payload
            const isTaxable = payload === 'Taxable'

            const pricing = calculateProposalPricing({
                proposalType: state.proposalType,
                items: state.offer.offerEntries,
                discountType: state.offer.discountType,
                discountValue: state.offer.discountValue,
                taxApplicable: state.offer.taxApplicable,
                taxRate: isTaxable ? 10 : 0,
                basePrice: state.offer.basePrice,
             })

             const newState = {
                ...state,
                clientType: payload,
                offer: {
                    ...state.offer,
                    ...pricing
                }
             }

             return newState
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

        case 'UPDATE_PROPOSAL_FIELD': {

            const newState = {
                ...state,
                ...action.payload
            }

            return newState
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

        case 'TOGGLE_TEAM_MEMBER': {
            const id = action.payload.memberId;

            const exists = state.selectedMembers.some(member => member.memberId === id);

            return {
            ...state,
            selectedMembers: exists
                ? state.selectedMembers.filter(member => member.memberId !== id)
                : [...state.selectedMembers, {memberId: id, teamMember: {
                    memberName: action.payload.memberName,
                    memberImage: action.payload.memberImage,    
                    memberRole: action.payload.memberRole,
                    description: action.payload.description
                }}]
            };
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
                timelines: timelinesReducer(state.timelines, action),
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