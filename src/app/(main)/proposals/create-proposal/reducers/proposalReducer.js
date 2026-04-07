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

    case 'SELECT_PACKAGE': {
      const pkg = action.payload
      
      const newState = {
          ...state,
          packageType: pkg.title,
          proposalDescription: pkg.description,
          proposedSolution: pkg.solution,
          basePrice: pkg.price
      }

      return {
          ...newState,
          ...calculateProposalPricing(newState)
      }
  }

    case 'TOGGLE_TEAM_MEMBER': {
    const id = action.payload;

    const exists = state.selectedTeamMembers.includes(id);

    return {
      ...state,
      selectedTeamMembers: exists
        ? state.selectedTeamMembers.filter(memberId => memberId !== id)
        : [...state.selectedTeamMembers, id]
    };
  }

    case 'SET_PROPOSAL_TYPE':
      return {
      ...createInitialProposal({ proposalType: action.payload, clientType: state.clientType }),
      proposalTitle: state.proposalTitle,
      executiveSummary: state.executiveSummary,
      
    };

    case 'SET_CLIENT_TYPE': {
      const nonTaxable = action.payload === 'Non-Taxable';
      const newState = {
        ...state,
        clientType: action.payload,
        taxApplicable: !nonTaxable,
        taxRate: !nonTaxable ? 10 : 0
      };

      return { ...newState, ...calculateProposalPricing(newState) }
    }

    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: action.payload
      }

    case 'CLEAR_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: {}
      }

    default: {
    const isItemProposal =
      state.proposalType === 'Product Proposal' ||
      state.proposalType === 'Service Proposal'

      const isSLA = state.proposalType === 'SLA Proposal'

      const updatedItems = isItemProposal
        ? itemsReducer(state.items || [], action)
        : undefined

      const updatedDeals = isSLA
        ? dealsReducer(state.deals || [], action)
        : undefined

      const newState = {
        ...state,
        ...(isItemProposal && { items: updatedItems }),
        ...(isSLA && { deals: updatedDeals }),
        timelines: timelineReducer(state.timelines, action),
      }

      const needsPricingUpdate =
        updatedItems !== state.items ||
        updatedDeals !== state.deals ||
        newState.basePrice !== state.basePrice

      if (needsPricingUpdate) {
        return { ...newState, ...calculateProposalPricing(newState) }
      }

      return newState
    }
  }
}