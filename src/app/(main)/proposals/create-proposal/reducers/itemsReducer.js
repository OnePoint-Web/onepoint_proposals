import {createItem} from './factories'

export function itemsReducer(state = [], action) {
  switch(action.type) {
    case 'ADD_ITEM':
      return [...state, createItem()];

    case 'UPDATE_ITEM':
      return state.map(item => 
        item.id === action.id ? { ...item, ...action.payload } : item
      );
    default:
      return state;
  }
}