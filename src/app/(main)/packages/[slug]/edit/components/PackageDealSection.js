'use client'
import styles from './PackageDealSection.module.scss'
import PackageDeal from '@/components/ui/draggables/package-deal/PackageDeal'
import AddItemButton from '@/components/ui/draggables/add-item-button/AddItemButton.js'

import {SortableContext, arrayMove} from '@dnd-kit/sortable';
import { DndContext } from '@dnd-kit/core'

export default function EditPackageDealSection({dealsState, dispatch}){

    const addDeal = () => {
        dispatch({ type: 'ADD_DEAL' })
    }

     const addListItem = (dealId) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: { dealId }
        })
    }
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        dispatch({
            type: 'REORDER_DEALS',
            payload: { activeId: active.id, overId: over.id }
        })
    }


    return(
        <div className={styles['section-main']}>
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={dealsState.map(i => i.packageDealItemId)}>
                    {dealsState.map(item => (
                        <PackageDeal 
                            key={item.packageDealItemId} 
                            id={item.packageDealItemId}
                            deal={item}
                            dealItems={item.packageDealEntries}
                            addListItem={() => addListItem(item.packageDealItemId)}
                            dispatch={dispatch}
                        />
                    ))}

                </SortableContext>
            </DndContext>

            <AddItemButton addItem={addDeal}/>
        </div>
    )
}