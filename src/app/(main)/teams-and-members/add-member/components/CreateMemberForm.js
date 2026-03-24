"use client"
import Form, {FormInputContainer} from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import ImageUploadAndPreview from './ImageUploadAndPreview'
import styles from './CreateMemberForm.module.scss'
import {useState, useEffect} from 'react'
import {useForm} from "react-hook-form"

import {zodResolver} from '@hookform/resolvers/zod'
import {createMemberSchema} from '@/schemas/member/createMember.schema.js'

export default function CreateMemberForm(){
    
    const [isSuccess, setIsSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null)

    const {
        register, 
        handleSubmit,   
        setValue,
        setError,
        reset,
        formState: { errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(createMemberSchema)
    })

    const onSubmit = async (data) => {
        try {
            const formData = new FormData()

            Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value)
            })

            if (imageFile && imageFile.size > 2_000_000) {
            alert("Image too large")
            return
            }

            if (imageFile) {
            formData.append('image', imageFile)
            }

            const res = await fetch('/api/members', {
            method: 'POST',
            body: formData
            })

            const result = await res.json()

            if (!res.ok) {
            console.error(result)
            return
            }

            reset()
            setImageFile(null)
            setIsSuccess(true)

        } catch (err) {
            console.error(err)
            setIsSuccess(false)
        }
    }

    return(
        <Form 
        header='Add a New OnePoint Member'
        description='Create a new member profile for OnePoint'
        onSubmit={handleSubmit(onSubmit)}>

        <fieldset className={styles['field-set']}>

            <FormInputContainer
                label='Member Name'
            >
                <Input
                    label='Member name:'
                    width="medium"
                    hideLabel={true}
                    placeholder='Full Name...'
                    error={errors.member_name ? 'error' : ''}
                    errorMessage={errors.member_name && errors.member_name  .message}
                    rules={{...register("member_name")}}
                />
            </FormInputContainer>
            

            <FormInputContainer
                label='Role'
            >

                <Input
                    label='Role'
                    width="medium"
                    hideLabel={true}
                    placeholder='Member role/position...'
                    error={errors.role ? 'error' : ''}
                    errorMessage={errors.role && errors.role.message}
                    rules={{...register("role")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Description'
            >

                <Input
                    label='Description'
                    width="medium"
                    hideLabel={true}
                    placeholder='Member description...'
                    error={errors.description ? 'error' : ''}
                    errorMessage={errors.description && errors.description.message}
                    rules={{...register("description")}}
                />
            </FormInputContainer> 
            
        </fieldset>

        <fieldset className={styles['field-set']}>

            <hr></hr>
            <h3>Upload Member Image</h3>
            <p></p>
            
            <ImageUploadAndPreview onFileSelect={setImageFile}/>
                
        </fieldset >

           { isSuccess && <p className={styles.success}>Member added successfully</p>}

            <Button 
                label={isSubmitting ? 'Creating account..' : 'Add Client'}
                size='xs'
                color='dark'
                action='submit'
                disabled={isSubmitting}
            />

        </Form>
    )
}

