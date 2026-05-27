'use client'

import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import Container from '@/components/layout/Container/Container.js'
import Button from '@/components/ui/button/Button'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import { Icons } from '@/components/icons/icons'
import styles from './page.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProductPage({productData}){
    const router = useRouter()
    const ErrorIcon = Icons.error
    const [toggleModal, setToggleModal] = useState(false)
    const [toggleDeletedModal, setToggleDeletedModal] = useState(false)

    const handleDelete = async () => {
        const res = await fetch(`/api/products/${productData.productId}`, { method: 'DELETE' })

        if (!res.ok) {
            console.error('Failed to delete product')
            return
        }

        setToggleModal(false)
        setToggleDeletedModal(true)

        setTimeout(() => {
            router.push('/products')
        }, 1000)
    }

    return(
        <ChildLayout>
            <Container>
                <div className={styles['item-container']}>
                    <p className={styles.header}>Product</p>

                    {productData.productImage && (
                        <div className={styles['image-preview']}>
                            <Image
                                src={productData.productImage}
                                alt={productData.product}
                                width={200}
                                height={200}
                            />
                        </div>
                    )}

                    <h1>{productData.product}</h1>
                    <p className={styles.price}>$ {productData.price}</p>

                    <hr></hr>

                    <p className={styles.header}>Overview</p>
                    <p>{productData.description || 'Product does not have a description'}</p>
                </div>

                <div className={styles['btn-container']}>
                    <Button
                        label='Edit'
                        size='xxs'
                        onClick={() => router.push(`/products/${productData.productId}/edit`)}
                    />

                    <Button
                        label='Delete'
                        size='xss'
                        color='red'
                        onClick={() => setToggleModal(true)}
                    />
                </div>

                {toggleModal && (
                    <div
                        className={styles['modal-bg']}
                        onClick={() => setToggleModal(false)}
                    >
                        <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
                            <p className={styles.head}><ErrorIcon className={styles.icon}/> Delete Product</p>
                            <p className={styles.body}>Are you sure you want to delete <span>{productData.product}?</span></p>

                            <div className={styles['delete-btns']}>
                                <Button
                                    label='Cancel'
                                    size='xss'
                                    color='dark'
                                    onClick={() => setToggleModal(false)}
                                />

                                <Button
                                    label='Confirm'
                                    size='xss'
                                    color='red'
                                    onClick={() => handleDelete()}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {toggleDeletedModal && (
                    <SuccessModal
                        message='Product deleted'
                        actionMessage='Redirecting to products list...'
                    />
                )}
            </Container>
        </ChildLayout>
    )
}
