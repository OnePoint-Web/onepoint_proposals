import styles from '../page.module.scss'
import {useReducer} from 'react'
import PackageDeal from '@/components/ui/draggables/package-deal/PackageDeal.js'
import AddItemButton from '@/components/ui/draggables/add-item-button/AddItemButton.js'

import {SortableContext, arrayMove} from '@dnd-kit/sortable';
import { DndContext } from '@dnd-kit/core'

export default function PackageDealsSection({deals, dispatch}){


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
        <div className={styles['child-container']}>
                        
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={deals.map(i => i.id)}>
                    {deals.map(item => (
                        <PackageDeal 
                            key={item.id} 
                            id={item.id}
                            deal={item}
                            dealItems={item.items}
                            addListItem={() => addListItem(item.id)}
                            dispatch={dispatch}
                        />
                    ))}

                </SortableContext>
            </DndContext>
                

            <AddItemButton addItem={addDeal}/>
        </div>
    )
}