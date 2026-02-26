"use client"
import Form, {FormInputContainer} from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import styles from './UserCreationForm.module.scss'
import {useState, useEffect} from 'react'
import {useForm} from "react-hook-form"

import {zodResolver} from '@hookform/resolvers/zod'
import {createUserSchema} from '@/schemas/user/createUser.schema.js'

export default function CreateUserForm(){

    const [roles, setRoles] = useState([{
        id: '',
        name: ''
    }])

    const {
        register, 
        handleSubmit,   
        setValue,
        setError,
        formState: { errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(createUserSchema)
    })

    useEffect(() => {
        fetch("/api/roles")
        .then(res => res.json())
        .then(data => {
        const formattedRoles = data.map(role => ({
            id: role.roleId,
            name: role.role
            }))
            setRoles(formattedRoles)
        })
        .catch(err => console.error(err))

        setValue("role", String(roles[0].roleId))
    }, [])

    roles && console.log(roles)

    const onSubmit = async (data) => {
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        const result = await res.json()
        console.log(result)

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

        console.log("Success:", result)
    }

    return(
        <Form onSubmit={handleSubmit(onSubmit)}>

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

            <FormInputContainer
                label='Password'
            >

                <Input
                    label='Password'
                    type='password'
                    width="medium"
                    hideLabel={true}
                    placeholder='Account password...'
                    error={errors.password ? 'error' : ''}
                    errorMessage={errors.password && errors.password.message}
                    rules={{...register("password")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Confirm Password'
            >

                <Input
                    label='Password'
                    type='password'
                    width="medium"
                    hideLabel={true}
                    placeholder='Confirm password'
                    error={errors.confirm_password ? 'error' : ''}
                    errorMessage={errors.confirm_password && errors.confirm_password.message}
                    rules={{...register("confirm_password")}}
                />
            </FormInputContainer>
            

            <FormInputContainer
                label='Role'
            >

                <div className={` ${styles['input-child']}`}>
                    <Input
                        label='Role'
                        type='select'
                        values={roles}
                        hideLabel={true}
                        placeholder='Confirm password'
                        error={errors.role ? 'error' : ''}
                        errorMessage={errors.role && errors.role.message}
                        rules={{...register("role")}}
                    />
                </div>
                
            </FormInputContainer>
            
        </fieldset>

            <Button 
                label='Add User'
                size='xs'
                color='dark'
                action='submit'
                disable={isSubmitting}
            />

        </Form>
    )
}

