'use client'
/* eslint-disable @next/next/no-img-element */

import styles from '../DraggablesItem.module.scss'
import {Icons} from '@/components/icons/icons.js'
import Input from '@/components/ui/input/Input.js'
import {useMemo, useState} from 'react'
import Button from '../../button/Button'
import ProductImageUploadAndPreview from '@/app/(main)/products/components/ProductImageUploadAndPreview'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ProductIcon = Icons.products
const ServiceIcon = Icons.services
const DeleteIcon = Icons.delete
const DragIcon = Icons.drag

export default function ProductServiceItem({id, items, dispatch, proposalType, index, errors, serviceProductItems}){
    const [isPickerOpen, setIsPickerOpen] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [pickerSearch, setPickerSearch] = useState('')
    const [imageSearch, setImageSearch] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)

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
    const pickerItems = useMemo(() => serviceProductItems || [], [serviceProductItems])

    const filteredPickerItems = useMemo(() => {
        const query = pickerSearch.trim().toLowerCase()
        if (!query) return pickerItems

        return pickerItems.filter(item =>
            item.name?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
        )
    }, [pickerItems, pickerSearch])

    const imageItems = useMemo(() => {
        const query = imageSearch.trim().toLowerCase()
        return pickerItems
            .filter(item => item.image)
            .filter(item => {
                if (!query) return true
                return item.name?.toLowerCase().includes(query) ||
                    item.description?.toLowerCase().includes(query)
            })
    }, [pickerItems, imageSearch])

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

    const handleSelectCatalogItem = (item) => {
        dispatch({
            type: 'SELECT_SERVICE_PRODUCT_ITEM',
            payload: {
                itemId: id,
                item
            }
        })
        setIsPickerOpen(false)
        setPickerSearch('')
    }

    const handleSelectImage = (imageUrl) => {
        dispatch({
            type: 'UPDATE_PRODUCT_ITEM_IMAGE',
            payload: {
                itemId: id,
                itemImage: imageUrl
            }
        })
        setIsImageModalOpen(false)
        setImageSearch('')
    }

    const handleUploadImage = async () => {
        if (!imageFile || isUploadingImage) return

        setIsUploadingImage(true)

        try{
            const formData = new FormData()
            formData.append('image', imageFile)

            const res = await fetch('/api/uploads', {
                method: 'POST',
                body: formData
            })

            const result = await res.json()

            if (!res.ok) {
                console.error(result)
                return
            }

            handleSelectImage(result.url)
            setImageFile(null)
        }catch(err){
            console.error(err)
        }finally{
            setIsUploadingImage(false)
        }
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

                    <div className={styles['select-product-button']}>
                        <div
                            className={styles['select-product-icon']}
                            onClick={() => setIsPickerOpen(true)}
                        >
                            {proposalType === 'Product Proposal' ? (
                                <ProductIcon className={styles['icon']}/> 
                            ): ( <ServiceIcon className={styles['icon']}/> ) }
                        </div>
                        
                    </div>
                    
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

                    {  proposalType === 'Product Proposal' &&      
                    <div className={styles['product-image-container']}> 
                        <p>Add Image</p>
                        <div className={styles['product-image-box']}>
                            
                            <div className={styles['product-image']}>
                                {currentItem.itemImage && (
                                    <img src={currentItem.itemImage} alt={currentItem.serviceProductItem || 'Item image'}/>
                                )}
                            </div>
                            
                            <div className={styles['image-buttons']}>
                                <Button 
                                    color='light'
                                    size='small'
                                    label='Select Image'
                                    onClick={() => setIsImageModalOpen(true)}
                                    >
                                </Button>
                                <Button 
                                    color='light'
                                    size='small'
                                    fit='small'
                                    label='Remove'
                                    onClick={() => handleSelectImage('')}
                                    >
                                </Button>
                            </div>

                        </div>
                    </div>
                    }

                    <Input
                        label='Notes/Description:'
                        name='item_description'
                        type="textarea"
                        width='full'
                        value={currentItem.itemDescription ?? currentItem.description ?? ''}
                        placeholder={`Enter ${typeProposal} description and notes here:`}
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRODUCT_ITEM',
                                payload: { itemId: id, data: {itemDescription: e.target.value, description: e.target.value} }
                                
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

            {isPickerOpen && (
                <div className={styles['item-picker-bg']} onClick={() => setIsPickerOpen(false)}>
                    <div className={styles['item-picker-modal']} onClick={(e) => e.stopPropagation()}>
                        <div className={styles['modal-head']}>
                            <p>Select {typeProposal}</p>
                            <button type='button' onClick={() => setIsPickerOpen(false)}>Close</button>
                        </div>

                        <Input
                            label={`Search ${typeProposal}:`}
                            width='full'
                            value={pickerSearch}
                            placeholder={`Search ${typeProposal.toLowerCase()}s...`}
                            onChange={(e) => setPickerSearch(e.target.value)}
                        />

                        <div className={styles['picker-results']}>
                            {filteredPickerItems.length > 0 ? filteredPickerItems.map(item => (
                                <button
                                    type='button'
                                    key={item.id}
                                    className={styles['picker-row']}
                                    onClick={() => handleSelectCatalogItem(item)}
                                >
                                    {item.image && (
                                        <img src={item.image} alt={item.name}/>
                                    )}
                                    <span>
                                        <strong>{item.name}</strong>
                                        <small>$ {item.price}</small>
                                    </span>
                                </button>
                            )) : <p className={styles['empty-text']}>No matching items found</p>}
                        </div>
                    </div>
                </div>
            )}

            {isImageModalOpen && (
                <div className={styles['item-picker-bg']} onClick={() => setIsImageModalOpen(false)}>
                    <div className={styles['image-picker-modal']} onClick={(e) => e.stopPropagation()}>
                        <div className={styles['modal-head']}>
                            <p>Select Item Image</p>
                            <button type='button' onClick={() => setIsImageModalOpen(false)}>Close</button>
                        </div>

                        <Input
                            label='Search Images:'
                            width='full'
                            value={imageSearch}
                            placeholder='Search product images...'
                            onChange={(e) => setImageSearch(e.target.value)}
                        />

                        <div className={styles['image-grid']}>
                            {imageItems.length > 0 ? imageItems.map(item => (
                                <button
                                    type='button'
                                    key={item.id}
                                    className={styles['image-option']}
                                    onClick={() => handleSelectImage(item.image)}
                                >
                                    <img src={item.image} alt={item.name}/>
                                    <span>{item.name}</span>
                                </button>
                            )) : <p className={styles['empty-text']}>No product images found</p>}
                        </div>

                        <hr></hr>

                        <div className={styles['upload-image-section']}>
                            <p>Upload Image</p>
                            <ProductImageUploadAndPreview onFileSelect={setImageFile}/>
                            <Button
                                color='dark'
                                size='xs'
                                label={isUploadingImage ? 'Uploading...' : 'Use Uploaded Image'}
                                disabled={!imageFile || isUploadingImage}
                                onClick={handleUploadImage}
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
