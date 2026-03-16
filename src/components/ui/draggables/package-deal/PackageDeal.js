'use client'
import styles from './PackageDeal.module.scss'
import {Icons} from '@/components/icons/icons.js'
import Input from '@/components/ui/input/Input.js'
import {useState} from 'react'

import InclusionsItem from './InclusionItem.js'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DeleteIcon = Icons.delete
const DragIcon = Icons.drag

export default function PackageDeal({dealItems, addListItem, id, setDeals}){
    
    const [itemType, setItemType] = useState('Paragraph')

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const updateDealItems = (dealId, newItems) => {
        setDeals(prev =>
            prev.map(deal =>
            deal.id === dealId ? { ...deal, items: newItems } : deal
            )
        )
    }


    return(
        <div className={styles['package-deal-container']} ref={setNodeRef} style={style} {...attributes}>

            <div className={styles['deals-child']}>
                <Input
                    label='Deal Item type:'
                    type='select'
                    values={[
                            {id: 'Paragraph', name: 'Paragraph'}, 
                            {id: 'List', name: 'List'}
                        ]}
                    onChange={(e) => setItemType(e.target.value)}
                />

                <Input
                    label='Package:'
                />
            </div>

            {itemType === 'Paragraph' ? (
                <SingleItem/>
            ) :
            (   
                <InclusionsItem
                    listItems={dealItems}
                    addListItem={addListItem}
                    onReorder={(newItems) =>
                        updateDealItems(id, newItems)
                    }
                />
            )}
           

            <div className={styles['handlers']}>

                <div className={`${styles['handler-btn']} ${styles['delete']}`}>   
                    <DeleteIcon className={styles.icon}></DeleteIcon>
                </div>

                <hr></hr>
                
                <div className={`${styles['handler-btn']} ${styles['drag']}`}  {...listeners}>   
                    <DragIcon className={styles.icon}></DragIcon>
                </div>
            </div>

        </div>
    )
}

const SingleItem = () => {
    return(
       <div className={styles['item-container']}>
            <label>Item Description:</label>
            <textarea></textarea>
        </div>
    )
}
