'use client'

import styles from './page.module.scss'
import Form, { FormInputContainer } from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import Container from '@/components/layout/Container/Container'
import ProductImageUploadAndPreview from '../../components/ProductImageUploadAndPreview'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EditProductPage({productData}){
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [toggleModal, setToggleModal] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [formData, setFormData] = useState({
        product: productData.product || '',
        price: productData.price || '',
        description: productData.description || '',
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

        try{
            const payload = new FormData()
            payload.append('product', formData.product)
            payload.append('price', formData.price)
            payload.append('description', formData.description)
            payload.append('removeImage', removeImage ? 'true' : 'false')

            if (imageFile && imageFile.size > 2_000_000) {
                alert('Image is too large')
                setIsSubmitting(false)
                return
            }

            if (imageFile) {
                payload.append('image', imageFile)
            }

            const res = await fetch(`/api/products/${productData.productId}/edit`, {
                method: 'PATCH',
                body: payload,
            })

            if (!res.ok) return

            setToggleModal(true)
            setIsSuccess(true)
            setImageFile(null)
            setRemoveImage(false)

            setTimeout(() => {
                router.push('/products')
            }, 1000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return(
        <Container>
            <Form
                header={`You are now editing ${productData.product}`}
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
                    <h3>Edit Product Image</h3>
                    <p>Image file must not exceed 2MB. Crop is 1:1 and exports at 200 x 200 px.</p>

                    <ProductImageUploadAndPreview
                        onFileSelect={setImageFile}
                        onImageRemove={setRemoveImage}
                        initialImage={productData.productImage}
                    />
                </fieldset>

                {isSuccess && <p className={styles.success}>Product updated successfully</p>}

                <Button
                    label={isSubmitting ? 'Applying changes..' : 'Update Product'}
                    size='xs'
                    color='dark'
                    action='submit'
                    disabled={isSubmitting}
                />

                {toggleModal && (
                    <SuccessModal
                        message='Product Updated!'
                        actionMessage='Redirecting to products list...'
                    />
                )}
            </Form>
        </Container>
    )
}
