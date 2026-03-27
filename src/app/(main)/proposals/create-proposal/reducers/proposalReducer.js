import { dealsReducer } from './dealsReducer'
import { timelineReducer } from './timelineReducer'
import {itemsReducer} from './itemsReducer'
import {createInitialProposal} from'./factories'
import {calculateProposalPricing} from '@/modules/pricing/calculateProposalPricing'

export function proposalReducer(state, action) {
  switch (action.type) {
    case 'INIT_PROPOSAL':
      return action.payload  // just replace the whole state with the initialized proposal

    case 'UPDATE_PROPOSAL_FIELD': {
      const newState = { ...state, ...action.payload }

      // Check if any pricing-related field changed
      const pricingInputs = [
        'items',
        'basePrice',
        'discountType',
        'discountValue',
        'taxApplicable',
        'taxRate',
        'proposalType'
      ]

      const needsPricingUpdate = pricingInputs.some(key => key in action.payload)

      if (needsPricingUpdate) {
        return { ...newState, ...calculateProposalPricing(newState) }
      }

      return newState
    }

    case 'SET_PROPOSAL_TYPE':
      return {
      ...createInitialProposal({ proposalType: action.payload, clientType: state.clientType }),
      proposalTitle: state.proposalTitle,
      executiveSummary: state.executiveSummary,
    };

    case 'SET_CLIENT_TYPE': {
      const nonTaxable = action.payload === 'Non-Taxable';
      return {
        ...state,
        clientType: action.payload,
        taxApplicable: !nonTaxable,
        taxRate: !nonTaxable ? 10 : 0
      };
    }

    default:
      const updatedItems =
        state.proposalType === 'Product Proposal' || state.proposalType === 'Service Proposal'
          ? itemsReducer(state.items, action)
          : state.items

      const newState = {
        ...state,
        items: updatedItems,
        deals:
          state.proposalType === 'SLA Proposal'
            ? dealsReducer(state.deals, action)
            : state.deals,
        timelines: timelineReducer(state.timelines, action),
      }
      
      const needsPricingUpdate = updatedItems !== state.items

      if (needsPricingUpdate) {
        return { ...newState, ...calculateProposalPricing(newState) }
      }

      return newState
  }
}