"use client"
import Form, {FormInputContainer} from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import ImageUploadAndPreview from './ImageUploadAndPreview'
import styles from './CreateMemberForm.module.scss'
import {useState, useEffect} from 'react'
import {useForm} from "react-hook-form"

import {zodResolver} from '@hookform/resolvers/zod'
import {createClientSchema} from '@/schemas/client/createClient.schema.js'

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
        resolver: zodResolver(createClientSchema)
    })

    const onSubmit = async (data) => {
  try {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

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
                    label='Username:'
                    width="medium"
                    hideLabel={true}
                    placeholder='Account username...'
                    error={errors.username ? 'error' : ''}
                    errorMessage={errors.username && errors.username.message}
                    rules={{...register("username")}}
                />
            </FormInputContainer>
            

            <FormInputContainer
                label='Role'
            >

                <Input
                    label='First Name'
                    width="medium"
                    hideLabel={true}
                    placeholder='User first name...'
                    error={errors.first_name ? 'error' : ''}
                    errorMessage={errors.first_name && errors.first_name.message}
                    rules={{...register("first_name")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Description'
            >

                <Input
                    label='Last Name'
                    width="medium"
                    hideLabel={true}
                    placeholder='User last name...'
                    error={errors.last_name ? 'error' : ''}
                    errorMessage={errors.last_name && errors.last_name.message}
                    rules={{...register("last_name")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Status'
            >

                <Input
                    label='Email'
                    width="medium"
                    hideLabel={true}
                    placeholder='Account email...'
                    error={errors.email ? 'error' : ''}
                    errorMessage={errors.email && errors.email.message}
                    rules={{...register("email")}}
                />
            </FormInputContainer>    
            
        </fieldset>

        <fieldset className={styles['field-set']}>

            <hr></hr>
            <h3>Upload Member Image</h3>
            <p></p>
            
            <ImageUploadAndPreview onFileSelect={setImageFile}/>
                
        </fieldset >

           { isSuccess && <p className={styles.success}>Client account created successfully</p>}

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

