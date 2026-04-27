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
        t.timelineId === action.payload.timelineId
          ? { ...t, ...action.payload.data }
          : t
      )

    case 'ADD_SCOPE':
      return timelines.map(t =>
        t.timelineId === action.payload.timelineId
          ? { ...t, timelineScopeItems: recalcOrder([...t.timelineScopeItems, createTimelineScope()], "order") }
          : t
      )

    case 'UPDATE_SCOPE':
      return timelines.map(t =>
        t.timelineId === action.payload.timelineId
          ? {
              ...t,
              timelineScopeItems: t.timelineScopeItems.map(scope =>
                scope.scopeItemId === action.payload.scopeId
                  ? { ...scope, ...action.payload.data }
                  : scope
              )
            }
          : t
      )

    case 'REORDER_SCOPE': {
      const { timelineId, activeId, overId } = action.payload
      return timelines.map(t => {
        if (t.timelineId !== timelineId) return t

        const oldIndex = t.timelineScopeItems.findIndex(s => s.scopeItemId === activeId)
        const newIndex = t.timelineScopeItems.findIndex(s => s.scopeItemId === overId)
        if (oldIndex === -1 || newIndex === -1) return t

        const reorderedScopes = arrayMove(t.timelineScopeItems, oldIndex, newIndex)
        return { ...t, timelineScopeItems: recalcOrder(reorderedScopes, "order") }
      })
    }

    case 'DELETE_TIMELINE': {
      const filtered = timelines.filter(t => t.timelineId !== action.payload.timelineId)
      return recalcOrder(filtered, "display_order")
    }

    case 'DELETE_SCOPE':
      return timelines.map(t =>
        t.timelineId === action.payload.timelineId
          ? { ...t, timelineScopeItems: recalcOrder(t.timelineScopeItems.filter(s => s.scopeItemId !== action.payload.scopeId), "order") }
          : t
      )

    default:
      return timelines
  }
}