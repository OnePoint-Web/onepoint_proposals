import { dealsReducer } from './dealsReducer'
import { timelineReducer } from './timelineReducer'
import {itemsReducer} from './itemsReducer'
import {createInitialProposal} from'./factories'


export function proposalReducer(state, action) {
  switch (action.type) {
    case 'INIT_PROPOSAL':
      return action.payload  // just replace the whole state with the initialized proposal

    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };

    case 'SET_PROPOSAL_TYPE':
      return {
      ...createInitialProposal({ proposalType: action.payload, clientType: state.clientType }),
      proposalTitle: state.proposalTitle,
      executiveSummary: state.executiveSummary,
    };

    case 'SET_CLIENT_TYPE':
    return {
      ...state, 
      clientType: action.payload,
    };


    default:
    return {
      ...state,
      deals:
        state.proposalType === 'SLA Proposal'
          ? dealsReducer(state.deals, action)
          : state.deals,
      timelines: timelineReducer(state.timelines, action),
      items:
        state.proposalType === 'Product Proposal' || state.proposalType === 'Service Proposal'
          ? itemsReducer(state.items, action)
          : state.items,
    };
  }
}