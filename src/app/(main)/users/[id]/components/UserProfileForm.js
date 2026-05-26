"use client"
import Form, {FormInputContainer} from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import styles from './UserProfileForm.module.scss'
import {useState, useEffect} from 'react'
import { useParams } from 'next/navigation'

export default function UserProfileForm(){

    const params = useParams()

    const {id} = params

    const [isSuccess, setIsSuccess] = useState(false);
    const [user, setUser] = useState({})

    useEffect(()=>{
        const fetchData = async () => {
            const userData = await fetch(`/api/users/${id}`)
            .then(res => res.json())
            .then(result => result.data)
            
            setUser(userData)
        }
        
        fetchData()
    }, [])

    if(!user) return <p>Loading user data</p> 

    console.log(user)

    return(
        <Form 
            header='User Profile'
            description=''
        >

        <fieldset className={styles['field-set']}>

            <FormInputContainer
                label='Username'
            >
                <Input
                    label='Username:'
                    width="medium"
                    type='text'
                    value={user.username}
                    hideLabel={true}
                    disabled={true}
                    placeholder='Account username...'
                    onChange={()=>{}}
                />
            </FormInputContainer>
            

            <FormInputContainer
                label='First Name'
            >

                <Input
                    label='First Name'
                    width="medium"
                    disabled={true}
                    hideLabel={true}
                     type='text'
                    placeholder='User first name...'
                    onChange={()=>{}}
                    value={user.firstName}
                    // error={errors.first_name ? 'error' : ''}
                    // errorMessage={errors.first_name && errors.first_name.message}
                    // rules={{...register("first_name")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Last Name'
            >

                <Input
                    label='Last Name'
                    width="medium"
                    type='text'
                    hideLabel={true}
                    disabled={true}
                    placeholder='User last name...'
                    onChange={()=>{}}
                    value={user.lastName}
                    // error={errors.last_name ? 'error' : ''}
                    // errorMessage={errors.last_name && errors.last_name.message}
                    // rules={{...register("last_name")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Email'
            >

                <Input
                    label='Email'
                    width="medium"
                    disabled={true}
                    hideLabel={true}
                    placeholder='Account email...'
                    onChange={()=>{}}
                    value={user.userEmail}
                    // error={errors.email ? 'error' : ''}
                    // errorMessage={errors.email && errors.email.message}
                    // rules={{...register("email")}}
                />
            </FormInputContainer>

            {/* <FormInputContainer
                label='Password'
            >

                <Input
                    label='Password'
                    type='password'
                    width="medium"
                    disabled={true}
                    hideLabel={true}
                    placeholder='Account password...'
                />
                
            </FormInputContainer>

            <FormInputContainer
                label='Confirm Password'
            >

                <Input
                    label='Password'
                    type='password'
                    width="medium"
                    disabled={true}
                    hideLabel={true}
                    placeholder='Confirm password'
                />
            </FormInputContainer> */}
            

            <FormInputContainer
                label='Role'
            >

               
                    <Input
                        label='Role'
                        type='text'
                        disabled={true}
                        hideLabel={true}
                        onChange={()=>{}}
                        value={user.role.role}
                        placeholder='Confirm password'
                    />
         
                
            </FormInputContainer>

            <FormInputContainer
                label='Status'
            >

               
                    <Input
                        label='Status'
                        type='text'
                        disabled={true}
                        hideLabel={true}
                        onChange={()=>{}}
                        value={user.userStatus.status}
                        placeholder='Confirm password'
                    />
         
                
            </FormInputContainer>
            
        </fieldset>
        
        </Form>
    )
}

