'use client'

import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import Container from '@/components/layout/Container/Container.js'
import Button from '@/components/ui/button/Button'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import { Icons } from '@/components/icons/icons'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ServicePage({serviceData}){
    const router = useRouter()
    const ErrorIcon = Icons.error
    const [toggleModal, setToggleModal] = useState(false)
    const [toggleDeletedModal, setToggleDeletedModal] = useState(false)

    const handleDelete = async () => {
        const res = await fetch(`/api/services/${serviceData.serviceId}`, { method: 'DELETE' })

        if (!res.ok) {
            console.error('Failed to delete service')
            return
        }

        setToggleModal(false)
        setToggleDeletedModal(true)

        setTimeout(() => {
            router.push('/services')
        }, 1000)
    }

    return(
        <ChildLayout>
            <Container>
                <div className={styles['item-container']}>
                    <p className={styles.header}>Service</p>
                    <h1>{serviceData.service}</h1>
                    <p className={styles.price}>$ {serviceData.price}</p>

                    <hr></hr>

                    <p className={styles.header}>Overview</p>
                    <p>{serviceData.description || 'Service does not have a description'}</p>
                </div>

                <div className={styles['btn-container']}>
                    <Button
                        label='Edit'
                        size='xxs'
                        onClick={() => router.push(`/services/${serviceData.serviceId}/edit`)}
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
                            <p className={styles.head}><ErrorIcon className={styles.icon}/> Delete Service</p>
                            <p className={styles.body}>Are you sure you want to delete <span>{serviceData.service}?</span></p>

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
                        message='Service deleted'
                        actionMessage='Redirecting to services list...'
                    />
                )}
            </Container>
        </ChildLayout>
    )
}
