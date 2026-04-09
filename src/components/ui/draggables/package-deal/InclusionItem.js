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

export default function InclusionsItem({ listItems, dealId, dispatch }) {

    const handleDragEnd = (event) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      dispatch({
        type: 'REORDER_ITEMS',
        payload: { dealId, activeId: active.id, overId: over.id }
      })
    }

    const addListItem = () => {
      dispatch({
        type: 'ADD_ITEM',
        payload: { dealId }
      })
    }

    const deleteItem = (itemId) => {
      dispatch({
        type: 'DELETE_ITEM',
        payload: { dealId, itemId: itemId }
      })
    }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={listItems.map(i => i.id)}>
        <div className={styles['item-container']}>
          <label>Item Inclusions/Scope:</label>

          {listItems.map(item => (
            <SortableItem 
              key={item.id} 
              item={item} 
              deleteItem={() => deleteItem(item.id)}
              dispatch={dispatch}
              dealId={dealId}/>
          ))}

          <div className={styles['add-item-btn']} onClick={addListItem}>
            <AddIcon className={styles['add-btn']} />
          </div>
        </div>
      </SortableContext>
    </DndContext>
  )
}

// Each list item
function SortableItem({ item, deleteItem, dispatch, dealId }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className={styles['item-input']} {...attributes}>
      <Input 
        hideLabel
        type='text'
        value={item.entry || ''}
        width="full"  
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_ITEM',
            payload: { dealId, itemId: item.id, data: { entry: e.target.value } }
          })
        }
        />

      <div className={styles['item-btns-container']}>
        <div className={styles['item-btn']}
          onClick={deleteItem}
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