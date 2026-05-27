import styles from '../page.module.scss'
import {useReducer} from 'react'
import ProductServiceItem from '@/components/ui/draggables/product-service/ProductServiceItem.js'
import AddItemButton from '@/components/ui/draggables/add-item-button/AddItemButton.js'

import {SortableContext, arrayMove} from '@dnd-kit/sortable';
import { DndContext } from '@dnd-kit/core'


export default function ProposalItemSection({items, dispatch, proposalType, errors, serviceProductItems = []}){


    const addItem = () => {
        dispatch({ type: 'ADD_PRODUCT_ITEM' })
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        dispatch({
            type: 'REORDER_PRODUCT_ITEM',
            payload: { activeId: active.id, overId: over.id }
        })
    }

    return(
        <div className={styles['child-container']}>
                        
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.offerEntryId)}>
                    {items.map((item, index) => (
                        <ProductServiceItem 
                            key={item.offerEntryId} 
                            id={item.offerEntryId}
                            dispatch={dispatch}
                            items={items}
                            errors={errors}
                            index={index}
                            proposalType={proposalType}
                            serviceProductItems={serviceProductItems}
                        />
                    ))}

                </SortableContext>
            </DndContext>
                
            <AddItemButton 
                addItem={addItem}
            />
        </div>
    )
}
