import { dealsReducer } from './dealsReducer'
import { timelineReducer } from './timelineReducer'

export function proposalReducer(state, action) {
  switch (action.type) {
    case 'INIT_PROPOSAL':
      return action.payload  // just replace the whole state with the initialized proposal

    default:
      return {
        ...state,
        deals: dealsReducer(state.deals, action),
        timelines: timelineReducer(state.timelines, action),
      }
  }
}