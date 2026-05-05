'use client'
import styles from '../DraggablesItem.module.scss'
import {Icons} from '@/components/icons/icons.js'
import Input from '@/components/ui/input/Input.js'
import {useState, useEffect} from 'react'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DeleteIcon = Icons.delete
const DragIcon = Icons.drag

export default function ProductServiceItem({id, items, dispatch, proposalType, index, errors}){

    function roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    const currentItem = items.find(i => i.offerEntryId === id) || {}

    const getDiscountConfig = () => {
        switch (currentItem.itemDiscountType) {
            case 'None':
                return { disabled: true, max: 0 }
            case 'Percentage':
                return { disabled: false, max: 100 }
            case 'Fixed':
                return { disabled: false, max: undefined }
            default:
                return { disabled: true, max: 0 }
        }
    }

    const discountConf = getDiscountConfig()

    let typeProposal = proposalType !== 'SLA Proposal' && proposalType === 'Product Proposal' ? 'Item' : 'Service'

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
                        label={`${typeProposal}:`}
                        name='proposal_item'
                        type="text"
                        value={currentItem.serviceProductItem}
                        error={errors?.[`items.${index}.item`]}
                        errorMessage={errors?.[`items.${index}.item`]}
                        placeholder={`${typeProposal} name...`}
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { 
                                    itemId: id, 
                                    data: {serviceProductItem: e.target.value} 
                                }
                            })
                        }}
                    />
                    
                    <Input
                        label='Price:'
                        name='item_base_price'
                        type='number'
                        width='small'
                        min={0} 
                        value={currentItem.itemPrice || 0}
                        error={errors?.[`items.${index}.itemPrice`]}
                        errorMessage={errors?.[`items.${index}.itemPrice`]}
                        placeholder={`${typeProposal} price...`}
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { 
                                    itemId: id, 
                                    data: {itemPrice: roundToTwo(e.target.value)} 
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
                        value={currentItem.quantity || 0}
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
                        value={currentItem.totalPrice || 0}
                        disabled={true}
                    />

                    <Input
                        label='Discounted total:'
                        name='discounted_total'
                        type='text'
                        width='small'
                        disabled={true}
                        value={currentItem.discountedTotal || 0}
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
                            value={currentItem.itemDiscountType}
                            width='small'
                            onChange={(e) => {
                            const value = e.target.value

                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { 
                                    itemId: id, 
                                    data: { 
                                        itemDiscountType: value,
                                        itemDiscountValue: value === 'None' ? 0 : currentItem.itemDiscountValue
                                    } 
                                }
                            })
                        }}
                       
                        />

                        <Input
                            key={currentItem.itemDiscountType + id}
                            label='Discount amount:'
                            type='number'
                            width='small'
                            placeholder='0'
                            value={currentItem.itemDiscountValue ?? 0}
                            min={0}
                            disabled={discountConf.disabled}
                            max={discountConf.max}
                            onChange={(e) => {
                                dispatch({
                                    type: 'UPDATE_PRODUCT_ITEM',
                                    payload: { itemId: id, data: {itemDiscountValue: Number(e.target.value)}}
                                    
                                })
                            }}
                        />

                        <Input
                            key={currentItem.itemDiscountType + '3' + id}
                            label='Discount reason:'
                            type='text'
                            width='full'
                            value={currentItem.itemDiscountDescription}
                            placeholder='Voucher, promo, sale...'
                            disabled={discountConf.disabled}
                            onChange={(e) => {
                                dispatch({
                                    type: 'UPDATE_PRODUCT_ITEM',
                                    payload: { itemId: id, data: {itemDiscountDescription: e.target.value} }
                                    
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
