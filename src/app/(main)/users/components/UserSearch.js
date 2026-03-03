'use client'
import styles from './UserSearch.module.scss';
import Container from '@/components/layout/Container/Container';
import Input from '@/components/ui/input/Input';
import {Icons} from '@/components/icons/icons.js'
import {useEffect, useState} from 'react'
import Link from 'next/link'

const UserIcon = Icons.users

export default function UserSearch(){

    const [status, setStatus] = useState([{
        id: '',
        name: ''
    }])

    useEffect(() => {
        fetch("/api/user-status")
        .then(res => res.json())
        .then(data => {
            const formattedStatus = data.map(status => ({
                id: status.statusId,
                name: status.status
            }))
            setStatus(formattedStatus)
        })

        console.log(status)
    }, [])

    return(
        <Container fit='fit'>

            <div className={styles['container-child']}>
                    <Input
                        label='Search User:'
                        name='user'
                        placeholder='Username, email, etc...'
                        size='sm'
                        width='full'
                    ></Input>

                    <div className={styles['button-container']}>
                        <label>____</label>
                        <Link className={styles['link-btn']} href='/users/create-user'>
                            <UserIcon className={styles.icon}/> Create User
                        </Link>
                    </div>
                </div>

                <div className={styles['container-child']}>
                    <Input
                        label='Search User:'
                        name='user'
                        placeholder='Username, email, etc...'
                        size='sm'
                    ></Input>

                    <Input
                        label='Search User:'
                        name='user'
                        type='select'
                        values={status}
                        placeholder='Username, email, etc...'
                        size='sm'
                    ></Input>

                    <Input
                        label='Search User:'
                        name='user'
                        placeholder='Username, email, etc...'
                        size='sm'
                    ></Input>
                </div>
            
        </Container>
    )
}

