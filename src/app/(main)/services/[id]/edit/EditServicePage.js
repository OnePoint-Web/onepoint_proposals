'use client'

import styles from './page.module.scss'
import Form, { FormInputContainer } from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import Container from '@/components/layout/Container/Container'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EditServicePage({serviceData}){
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [toggleModal, setToggleModal] = useState(false)
    const [formData, setFormData] = useState({
        service: serviceData.service || '',
        price: serviceData.price || '',
        description: serviceData.description || '',
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
            const res = await fetch(`/api/services/${serviceData.serviceId}/edit`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                }),
            })

            if (!res.ok) return

            setToggleModal(true)
            setIsSuccess(true)

            setTimeout(() => {
                router.push('/services')
            }, 1000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return(
        <Container>
            <Form
                header={`You are now editing ${serviceData.service}`}
                onSubmit={onSubmit}
            >
                <fieldset className={styles['field-set']}>
                    <FormInputContainer label='Service Name'>
                        <Input
                            label='Service Name'
                            width='medium'
                            hideLabel={true}
                            placeholder='Service name...'
                            value={formData.service}
                            onChange={(e) => updateField('service', e.target.value)}
                        />
                    </FormInputContainer>

                    <FormInputContainer label='Price'>
                        <Input
                            label='Price'
                            type='number'
                            width='medium'
                            hideLabel={true}
                            placeholder='Service price...'
                            value={formData.price}
                            onChange={(e) => updateField('price', e.target.value)}
                        />
                    </FormInputContainer>

                    <Input
                        label='Description:'
                        type='textarea'
                        width='full'
                        placeholder='Service description...'
                        value={formData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                    />
                </fieldset>

                {isSuccess && <p className={styles.success}>Service updated successfully</p>}

                <Button
                    label={isSubmitting ? 'Updating service...' : 'Update Service'}
                    size='xs'
                    color='dark'
                    action='submit'
                    disabled={isSubmitting}
                />

                {toggleModal && (
                    <SuccessModal
                        message='Service Updated!'
                        actionMessage='Redirecting to services list...'
                    />
                )}
            </Form>
        </Container>
    )
}
