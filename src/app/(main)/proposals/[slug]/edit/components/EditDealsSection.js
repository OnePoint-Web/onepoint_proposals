import styles from './components.module.scss'
import {useReducer} from 'react'
import PackageDeal from '@/components/ui/draggables/package-deal/PackageDeal.js'
import AddItemButton from '@/components/ui/draggables/add-item-button/AddItemButton.js'
import {SortableContext, arrayMove} from '@dnd-kit/sortable';
import { DndContext } from '@dnd-kit/core'

export default function EditDealsSection({deals, dispatch}){

    const addDeal = () => {
        console.log('clicked')
        dispatch({ type: 'ADD_DEAL' })
    }

     const addListItem = (dealId) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: { dealId }
        })
    }
    const handleDragEnd = (event) => {
        console.log('dragging')
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
                <SortableContext items={deals.map(i => i.packageDealItemId)}>
                    {deals.map(item => (
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