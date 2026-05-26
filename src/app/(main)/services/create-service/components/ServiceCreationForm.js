'use client'

import styles from './ServiceCreationForm.module.scss'
import Form, { FormInputContainer } from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import { Icons } from '@/components/icons/icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ServiceIcon = Icons.services

export default function ServiceCreationForm(){
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [toggleModal, setToggleModal] = useState(false)
    const [formData, setFormData] = useState({
        service: '',
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
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                }),
            })

            if (!res.ok) return

            setIsSuccess(true)
            setToggleModal(true)
            setFormData({
                service: '',
                price: '',
                description: '',
            })

            setTimeout(() => {
                router.push('/services')
            }, 1000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return(
        <Form
            header='Create Services'
            description='Create a new service for proposal item selections'
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

            {isSuccess && <p className={styles.success}>Service created successfully</p>}

            <Button
                label={isSubmitting ? 'Creating service..' : 'Add Service'}
                size='xs'
                color='dark'
                action='submit'
                disabled={isSubmitting}
            />

            {toggleModal && (
                <SuccessModal
                    icon={ServiceIcon}
                    message='Service Successfully Created!'
                    actionMessage='Redirecting to services page...'
                />
            )}
        </Form>
    )
}
