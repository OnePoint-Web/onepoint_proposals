'use client'
import styles from './PackageDeal.module.scss'
import { Icons } from '@/components/icons/icons.js'
import Input from '@/components/ui/input/Input.js'

import { DndContext } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const DeleteIcon = Icons.delete
const DragIcon = Icons.drag
const AddIcon = Icons.plusButton

export default function InclusionsItem({ listItems, addListItem, onReorder }) {

    const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
        const oldIndex = listItems.findIndex(item => item.id === active.id);
        const newIndex = listItems.findIndex(item => item.id === over.id);
        onReorder(arrayMove(listItems, oldIndex, newIndex));
    }
    };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={listItems.map(i => i.id)}>
        <div className={styles['item-container']}>
          <label>Item Inclusions/Scope:</label>

          {listItems.map(item => (
            <SortableItem key={item.id} item={item} />
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
function SortableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className={styles['item-input']} {...attributes}>
      <Input hideLabel="true" width="full" value={item.entry} />

      <div className={styles['item-btns-container']}>
        <div className={styles['item-btn']}>
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