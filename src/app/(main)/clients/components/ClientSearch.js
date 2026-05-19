'use client'
import styles from './ClientSearch.module.scss';
import Container from '@/components/layout/Container/Container';
import Input from '@/components/ui/input/Input';
import {Icons} from '@/components/icons/icons.js'
import {useEffect, useState} from 'react'
import Link from 'next/link'

const UserIcon = Icons.users

export default function UserSearch({query, setQuery}){

    const [status, setStatus] = useState([{
        id: '',
        name: ''
    }])

    useEffect(() => {
        fetch("/api/user-status")
        .then(res => res.json())
        .then(data => {
            const formattedStatus = data.map(status => ({
                id: status.status,
                name: status.status
            }))
            setStatus(formattedStatus)
        })
    }, [])

    const statusOptions = [
        {id: '', name: 'All'},
        ...status
    ]

    return(
        <Container fit='fullwidth'>

            <div className={styles['container-child']}>
                    <Input
                        label='Search Client:'
                        type='text'
                        name='client'
                        placeholder='Username, name, email...'
                        value={query.search}
                        onChange={(e) => {
                            setQuery(prev => ({
                                ...prev,
                                search: e.target.value
                            }))
                        }}
                        size='sm'
                        width='full'
                    ></Input>

                    <div className={styles['button-container']}>
                        <label>____</label>
                        <Link className={styles['link-btn']} href='/users/create-client'>
                            <UserIcon className={styles.icon}/> Create New Client Account
                        </Link>
                    </div>
                </div>

                <div className={styles['container-child']}>
       
                    <Input
                        label='Account Status:'
                        name='user'
                        type='select'
                        values={statusOptions}
                        value={query.status}
                        onChange={(e) => {
                            setQuery(prev => ({
                                ...prev,
                                status: e.target.value
                            }))
                        }}
                        placeholder='-- Select Status --'
                        size='sm'
                    ></Input>
                </div>
            
        </Container>
    )
}

