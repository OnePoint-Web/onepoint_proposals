'use client'
import styles from '../DraggablesItem.module.scss'
import {Icons} from '@/components/icons/icons.js'
import Input from '@/components/ui/input/Input.js'
import {useState} from 'react'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DeleteIcon = Icons.delete
const DragIcon = Icons.drag

export default function ProductItem({id, dispatch}){
    
    const [itemType, setItemType] = useState('Paragraph')

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDeleteItem = (itemId) => {
        dispatch({
            type: 'DELETE_PRODUCT_ITEM',
            payload: { itemId }
        })
    }

    return(
        <div 
            className={styles['package-deal-container']} 
            ref={setNodeRef} 
            style={style} 
            {...attributes}
        >

            <div className={styles['item-child-container']}>
                <div className={`${styles['items-child']}`}>
                    <Input
                        label='Item:'
                        name='proposal_item'
                        type="text"
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { itemId: id, data: {item: e.target.value} }
                                
                            })
                        }}
                    />
                    
                    <Input
                        label='Price:'
                        type='text'
                        width='small'
                        // onChange={(e) => {
                        //     dispatch({
                        //         type: 'UPDATE_DEAL',
                        //         payload: { dealId: id, data: {item_type: e.target.value} }
                        //     })
                        //     setItemType(e.target.value)
                        // }}
                    />

                    <Input 
                        label='Quantity:'
                        type='number'
                        width='xsmall'
                        name='quantity'
                        min='1'
                    >
                    </Input>

                    <Input
                        label='Total:'
                        type='text'
                        width='small'
                        // onChange={(e) => {
                        //     dispatch({
                        //         type: 'UPDATE_DEAL',
                        //         payload: { dealId: id, data: {item_type: e.target.value} }
                        //     })
                        //     setItemType(e.target.value)
                        // }}
                    />

                    <Input
                        label='Subtotal - discount:'
                        type='text'
                        width='small'
                        // onChange={(e) => {
                        //     dispatch({
                        //         type: 'UPDATE_DEAL',
                        //         payload: { dealId: id, data: {item_type: e.target.value} }
                        //     })
                        //     setItemType(e.target.value)
                        // }}
                    />

                    
                    
                </div>

                <hr></hr>

                <div className={`${styles['items-child']}`}>
                    <Input
                        label='Notes/Description:'
                        name='proposal_item'
                        type="textarea"
                        width='full'
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { itemId: id, data: {item: e.target.value} }
                                
                            })
                        }}
                    />

                    <div className={styles['items-inner-container']}>
                        <Input
                            label='Subtotal - discount:'
                            type='text'
                            width='small'
                            // onChange={(e) => {
                            //     dispatch({
                            //         type: 'UPDATE_DEAL',
                            //         payload: { dealId: id, data: {item_type: e.target.value} }
                            //     })
                            //     setItemType(e.target.value)
                            // }}
                        />

                        <Input
                            label='Subtotal - discount:'
                            type='text'
                            width='small'
                            // onChange={(e) => {
                            //     dispatch({
                            //         type: 'UPDATE_DEAL',
                            //         payload: { dealId: id, data: {item_type: e.target.value} }
                            //     })
                            //     setItemType(e.target.value)
                            // }}
                        />

                        <Input
                            label='Subtotal - discount:'
                            type='text'
                            width='full'
                            // onChange={(e) => {
                            //     dispatch({
                            //         type: 'UPDATE_DEAL',
                            //         payload: { dealId: id, data: {item_type: e.target.value} }
                            //     })
                            //     setItemType(e.target.value)
                            // }}
                        />

                    </div>

                </div>


            </div>
            
           
            <div className={styles['handlers']}>

                <div className={`${styles['handler-btn']} ${styles['delete']}`}
                    onClick={() => handleDeleteItem(id)}
                >   
                    <DeleteIcon className={styles.icon}></DeleteIcon>
                </div>

                <hr></hr>
                
                <div className={`${styles['handler-btn']} ${styles['drag']}`}  
                    {...listeners}
                    >   
                    <DragIcon className={styles.icon}></DragIcon>
                </div>
            </div>

        </div>
    )
}
