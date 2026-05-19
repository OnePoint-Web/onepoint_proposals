"use client"
import styles from './page.module.scss'
import Form from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input.js'
import Button from '@/components/ui/button/Button.js'
import {useForm} from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import {useEffect, useState} from 'react'
import {userLoginSchema} from '@/schemas/user/userLogin.schema.js'
import {useRouter} from 'next/navigation'

export default function Login(){
    const [credentials, setCredentials] = useState([]);
    const [isError, setIsError] = useState([{error: false, message: ''}])
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(userLoginSchema)
    })


    const onLogin = async (data) => {
        if(isSubmitting) return

        try{
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify(data)
            })

            const result = await res.json()

            if(result.type === 'error'){
                setIsError( {error: true, message: result.message})
                return
            }

            router.push("/")

        }catch(err){

        }
    }
    


    return(
        <div className={styles['login-container']}>
            <div className={styles['form-container']}>

                <p>Please enter your details</p>
                <h2>Welcome Back</h2>
                

                <hr></hr>

                {isError.error && <p className={styles['error']}>{isError.message}</p>}

                <Form
                    onSubmit={handleSubmit(onLogin)}
                >

                <fieldset>
                    <Input
                        type="text"
                        width='full' 
                        placeholder='Enter your username'
                        error={errors.username ? 'error' : ''}
                        errorMessage={errors.username && errors.username.message}
                        rules={{...register("username")}}
                    />

                    <Input
                        width='full' 
                        type='password'
                        placeholder='Enter your password'
                        error={errors.password ? 'error' : ''}
                        errorMessage={errors.password && errors.password.message}
                        rules={{...register("password")}}
                    />

                </fieldset>

                <div className={styles['reg-container']}>
                    <div className={styles['checkbox']}>
                        <input type='checkbox'/> 
                    </div>
                    
                    <label>Remember for 30 days</label>
                </div>


                <Button
                    color='red'
                    label='Login'
                    fit='full'
                    size='md'
                    action='submit'
                />
                   
                </Form>

            </div>
        </div>
    )
}