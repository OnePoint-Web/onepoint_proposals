import { arrayMove } from '@dnd-kit/sortable'
import { createTimeline, createTimelineScope } from './factories'

const recalcOrder = (list, field) =>
  list.map((item, index) => ({
    ...item,
    [field]: index + 1
  }))

export const timelineReducer = (timelines, action) => {
  switch (action.type) {

    case 'ADD_TIMELINE': 
      return [...timelines, createTimeline()]

    case 'UPDATE_TIMELINE':
      return timelines.map(t =>
        t.id === action.payload.timelineId
          ? { ...t, ...action.payload.data }
          : t
      )

    case 'ADD_SCOPE':
      return timelines.map(t =>
        t.id === action.payload.timelineId
          ? { ...t, scopes: recalcOrder([...t.scopes, createTimelineScope()], "order") }
          : t
      )

    case 'UPDATE_SCOPE':
      return timelines.map(t =>
        t.id === action.payload.timelineId
          ? {
              ...t,
              scopes: t.scopes.map(scope =>
                scope.id === action.payload.scopeId
                  ? { ...scope, ...action.payload.data }
                  : scope
              )
            }
          : t
      )

    case 'REORDER_SCOPE': {
      const { timelineId, activeId, overId } = action.payload
      return timelines.map(t => {
        if (t.id !== timelineId) return t

        const oldIndex = t.scopes.findIndex(s => s.id === activeId)
        const newIndex = t.scopes.findIndex(s => s.id === overId)
        if (oldIndex === -1 || newIndex === -1) return t

        const reorderedScopes = arrayMove(t.scopes, oldIndex, newIndex)
        return { ...t, scopes: recalcOrder(reorderedScopes, "order") }
      })
    }

    case 'DELETE_TIMELINE': {
      const filtered = timelines.filter(t => t.id !== action.payload.timelineId)
      return recalcOrder(filtered, "display_order")
    }

    case 'DELETE_SCOPE':
      return timelines.map(t =>
        t.id === action.payload.timelineId
          ? { ...t, scopes: recalcOrder(t.scopes.filter(s => s.id !== action.payload.scopeId), "order") }
          : t
      )

    default:
      return timelines
  }
}