"use client"
import Form, {FormInputContainer} from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import styles from './ClientCreationForm.module.scss'
import {useState, useEffect} from 'react'
import {useForm} from "react-hook-form"

import {zodResolver} from '@hookform/resolvers/zod'
import {createClientSchema} from '@/schemas/client/createClient.schema.js'

export default function CreateClientForm(){

    const [isSuccess, setIsSuccess] = useState(false);

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
        if (isSubmitting) return
        setIsSuccess(false)
        try{
                const res = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

        const result = await res.json()

        if (!res.ok) {
            if (result.field) {
            setError(result.field, {
                type: "server",
                message: result.message,
            })
            return
            }
                console.error(result)
                return
        }

        reset()
        setIsSuccess(true)

        }catch(err){
            setIsSuccess(false)
            console.error(err)
        }
    }

    return(
        <Form 
        header='Create Client Account'
        description='Create a new client account for OnePoint proposals'
        onSubmit={handleSubmit(onSubmit)}>

        <fieldset className={styles['field-set']}>

            <FormInputContainer
                label='Username'
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
                label='First Name'
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
                label='Last Name'
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
                label='Email'
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

            <p className={styles.hint}>
                The client will be able to log in using the standard client portal password.
            </p>

        </fieldset>

        

        <fieldset className={styles['field-set']}>

            <hr></hr>
            <h3>Company Information</h3>
            <p></p>

            <FormInputContainer
                label='Company'
            >

                <Input
                    label='Company'
                    width="medium"
                    hideLabel={true}
                    placeholder='Company name...'
                    error={errors.company_name ? 'error' : ''}
                    errorMessage={errors.company_name && errors.company_name.message}
                    rules={{...register("company_name")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Company Email'
            >

                <Input
                    label='Company Email'
                    width="medium"
                    hideLabel={true}
                    placeholder='Company email...'
                    error={errors.company_email ? 'error' : ''}
                    errorMessage={errors.company_email && errors.company_email.message}
                    rules={{...register("company_email")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Company Address'
            >

                <Input
                    label='Company Address'
                    width="medium"
                    hideLabel={true}
                    placeholder='Company address...'
                    error={errors.company_address ? 'error' : ''}
                    errorMessage={errors.company_address && errors.company_address.message}
                    rules={{...register("company_address")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Website'
            >

                <Input
                    label='Company Website'
                    width="medium"
                    hideLabel={true}
                    placeholder='Company website...'
                    error={errors.website ? 'error' : ''}
                    errorMessage={errors.website && errors.website.message}
                    rules={{...register("website")}}
                />
            </FormInputContainer>
                
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

