'use client'
import styles from '../DraggablesItem.module.scss'
import {Icons} from '@/components/icons/icons.js'
import Input from '@/components/ui/input/Input.js'
import {useState} from 'react'

import InclusionsItem from './InclusionItem.js'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DeleteIcon = Icons.delete
const DragIcon = Icons.drag

export default function PackageDeal({dealItems, addListItem, id, dispatch}){
    
    const [itemType, setItemType] = useState('Paragraph')

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDeleteDeal = (dealId) => {
        dispatch({
            type: 'DELETE_DEAL',
            payload: { dealId }
        })
    }

    return(
        <div className={styles['package-deal-container']} ref={setNodeRef} style={style} {...attributes}>

            <div className={styles['deals-child']}>
                <Input
                    label='Item:'
                    name='deal_item'
                    type="text"
                    onChange={(e) => {
                        dispatch({
                            type: 'UPDATE_DEAL',
                            payload: { dealId: id, data: {item: e.target.value} }
                            
                        })
                    }}
                />
                
                <Input
                    label='Deal Item type:'
                    type='select'
                    values={[
                            {id: 'Paragraph', name: 'Paragraph'}, 
                            {id: 'List', name: 'List'}
                        ]}
                    onChange={(e) => {
                        dispatch({
                            type: 'UPDATE_DEAL',
                            payload: { dealId: id, data: {item_type: e.target.value} }
                        })
                        setItemType(e.target.value)
                    }}
                />
                
            </div>

            {itemType === 'Paragraph' ? (
                <SingleItem/>
            ) :
            (   
                <InclusionsItem
                    listItems={dealItems}
                    dealId={id}
                    dispatch={dispatch}
                />
            )}
           

            <div className={styles['handlers']}>

                <div className={`${styles['handler-btn']} ${styles['delete']}`}
                    onClick={() => handleDeleteDeal(id)}
                >   
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
