'use client'

import styles from './ProductCreationForm.module.scss'
import Form, { FormInputContainer } from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import { Icons } from '@/components/icons/icons'
import ProductImageUploadAndPreview from '../../components/ProductImageUploadAndPreview'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ProductIcon = Icons.products

export default function ProductCreationForm(){
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [toggleModal, setToggleModal] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [formData, setFormData] = useState({
        product: '',
        price: '',
        description: '',
    })

    const updateField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
        setIsSuccess(false)

        try{
            const payload = new FormData()
            payload.append('product', formData.product)
            payload.append('price', formData.price)
            payload.append('description', formData.description)

            if (imageFile && imageFile.size > 2_000_000) {
                alert('Image is too large')
                setIsSubmitting(false)
                return
            }

            if (imageFile) {
                payload.append('image', imageFile)
            }

            const res = await fetch('/api/products', {
                method: 'POST',
                body: payload,
            })

            if (!res.ok) return

            setIsSuccess(true)
            setToggleModal(true)
            setImageFile(null)
            setFormData({
                product: '',
                price: '',
                description: '',
            })

            setTimeout(() => {
                router.push('/products')
            }, 1000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return(
        <Form
            header='Create Product'
            description='Create a new product for proposal item selections'
            onSubmit={onSubmit}
        >
            <fieldset className={styles['field-set']}>
                <FormInputContainer label='Product Name'>
                    <Input
                        label='Product Name'
                        width='medium'
                        hideLabel={true}
                        placeholder='Product name...'
                        value={formData.product}
                        onChange={(e) => updateField('product', e.target.value)}
                    />
                </FormInputContainer>

                <FormInputContainer label='Price'>
                    <Input
                        label='Price'
                        type='number'
                        width='medium'
                        hideLabel={true}
                        placeholder='Product price...'
                        value={formData.price}
                        onChange={(e) => updateField('price', e.target.value)}
                    />
                </FormInputContainer>

                <Input
                    label='Description:'
                    type='textarea'
                    width='full'
                    placeholder='Product description...'
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                />
            </fieldset>

            <fieldset className={styles['field-set']}>
                <hr></hr>
                <h3>Upload Product Image</h3>
                <p>Image file must not exceed 2MB. Crop is 1:1 and exports at 200 x 200 px.</p>

                <ProductImageUploadAndPreview onFileSelect={setImageFile}/>
            </fieldset>

            {isSuccess && <p className={styles.success}>Product created successfully</p>}

            <Button
                label={isSubmitting ? 'Creating product..' : 'Add Product'}
                size='xs'
                color='dark'
                action='submit'
                disabled={isSubmitting}
            />

            {toggleModal && (
                <SuccessModal
                    icon={ProductIcon}
                    message='Product Successfully Created!'
                    actionMessage='Redirecting to products page...'
                />
            )}
        </Form>
    )
}
