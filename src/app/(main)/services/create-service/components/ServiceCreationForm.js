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
    const [errors, setErrors] = useState({})

    const updateField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }

    const validate = () => {
        const next = {}
        if (!formData.service.trim()) next.service = 'Service name is required'
        if (formData.price === '' || formData.price === null) {
            next.price = 'Price is required'
        } else if (Number(formData.price) < 0) {
            next.price = 'Price must be a positive number'
        }
        if (!formData.description.trim()) next.description = 'Description is required'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (isSubmitting) return
        if (!validate()) return

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
                        error={errors.service}
                        errorMessage={errors.service}
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
                        error={errors.price}
                        errorMessage={errors.price}
                        onChange={(e) => updateField('price', e.target.value)}
                    />
                </FormInputContainer>

                <Input
                    label='Description:'
                    type='textarea'
                    width='full'
                    placeholder='Service description...'
                    value={formData.description}
                    error={errors.description}
                    errorMessage={errors.description}
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
