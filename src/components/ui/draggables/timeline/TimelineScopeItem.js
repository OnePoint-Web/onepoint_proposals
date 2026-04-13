'use client'
import styles from '../DraggablesItem.module.scss'
import { Icons } from '@/components/icons/icons.js'
import Input from '@/components/ui/input/Input.js'

import { DndContext } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const DeleteIcon = Icons.delete
const DragIcon = Icons.drag
const AddIcon = Icons.plusButton

export default function TimelineScopeItem({ scopes, timelineId, dispatch }) {

    const handleDragEnd = (event) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      dispatch({
        type: 'REORDER_SCOPE',
        payload: { timelineId, activeId: active.id, overId: over.id }
      })
    }

    const addScope = () => {
      dispatch({
        type: 'ADD_SCOPE',
        payload: { timelineId }
      })
    }

    const deleteScope = (scopeId) => {
      dispatch({
        type: 'DELETE_SCOPE',
        payload: { timelineId, scopeId: scopeId }
      })
    }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={scopes.map(i => i.id)}>
        <div className={styles['item-container']}>
          <label>Scope:</label>

          {scopes.map(item => (
            <SortableItem 
              key={item.id} 
              scope={item} 
              deleteScope={() => deleteScope(item.id)}
              dispatch={dispatch}
              timelineId={timelineId}/>
          ))}

          <div className={styles['add-item-btn']} onClick={addScope}>
            <AddIcon className={styles['add-btn']} />
          </div>
        </div>
      </SortableContext>
    </DndContext>
  )
}

// Each list item
function SortableItem({ scope, deleteScope, dispatch, timelineId }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: scope.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className={styles['item-input']} {...attributes}>
      <Input 
        hideLabel
        width="full" 
        value={scope.scope} 
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_SCOPE',
            payload: { timelineId, scopeId: scope.id, data: { scope: e.target.value } }
          })
        }
        />

      <div className={styles['item-btns-container']}>
        <div className={styles['item-btn']}
          onClick={deleteScope}
        >
          <DeleteIcon />
        </div>

        <hr />

        <div className={styles['item-btn']} {...listeners}>
          <DragIcon />
        </div>
      </div>
    </div>
  )
}