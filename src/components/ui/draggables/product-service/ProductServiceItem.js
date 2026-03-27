'use client'
import styles from '../DraggablesItem.module.scss'
import {Icons} from '@/components/icons/icons.js'
import Input from '@/components/ui/input/Input.js'
import {useState, useEffect} from 'react'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DeleteIcon = Icons.delete
const DragIcon = Icons.drag

export default function ProductServiceItem({id, items, dispatch, proposalType}){

    let typeProposal = proposalType !== 'SLA Proposal' && proposalType === 'Product Proposal' ? 'Item' : 'Service'

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

     const item = items.find(i => i.id === id) || {}

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
                        label={`${typeProposal}:`}
                        name='proposal_item'
                        type="text"
                        placeholder={`${typeProposal} name...`}
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { 
                                    itemId: id, 
                                    data: {item: e.target.value} 
                                }
                            })
                        }}
                    />
                    
                    <Input
                        label='Price:'
                        name='item_base_price'
                        type='text'
                        width='small'
                        placeholder={`${typeProposal} price...`}
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { 
                                    itemId: id, 
                                    data: {itemPrice: e.target.value} 
                                }
                            })
                        }}
                    />

                    {proposalType === 'Product Proposal' && (<Input 
                        label='Quantity:'
                        type='number'
                        width='xsmall'
                        name='quantity'
                        min='1'
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { 
                                    itemId: id, 
                                    data: {quantity: Number(e.target.value)} 
                                }
                            })
                        }}
                    >
                    </Input>)}

                    <Input
                        label='Total:'
                        name='total_price'
                        type='text'
                        width='small'
                        value={item.totalPrice || 0}
                        disabled={true}
                    />

                    <Input
                        label='Discounted total:'
                        name='discounted_total'
                        type='text'
                        width='small'
                        disabled={true}
                        value={item.discountedTotal || 0}
                    />

                    
                    
                </div>

                <hr></hr>

                <div className={`${styles['items-child']}`}>
                    <Input
                        label='Notes/Description:'
                        name='item_description'
                        type="textarea"
                        width='full'
                        placeholder={`Enter ${typeProposal} description and notes here:`}
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { itemId: id, data: {itemDescription: e.target.value} }
                                
                            })
                        }}
                    />

                    <div className={styles['items-inner-container']}>
                        <Input
                            label={`${typeProposal} discount type:`}
                            type='select'
                            values={[
                                {id: 'None', name: 'No Discount'},
                                {id: 'Fixed', name: 'Fixed Amount'},
                                {id: 'Percentage', name: '(%) Percentage'}
                            ]}
                            width='small'
                            onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { itemId: id, data: {discountType: e.target.value} }
                                
                            })
                        }}
                       
                        />

                        <Input
                            label='Discount amount:'
                            type='text'
                            width='small'
                            placeholder='0'
                            onChange={(e) => {
                                dispatch({
                                    type: 'UPDATE_PRODUCT_ITEM',
                                    payload: { itemId: id, data: {discountValue: Number(e.target.value)}}
                                    
                                })
                            }}
                        />

                        <Input
                            label='Discount reason:'
                            type='text'
                            width='full'
                            placeholder='Voucher, promo, sale...'
                            onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { itemId: id, data: {discountDescription: e.target.value} }
                                
                            })
                        }}
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
