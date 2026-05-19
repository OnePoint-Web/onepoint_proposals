'use client'
import styles from './UserSearch.module.scss';
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

    const [roles, setRoles] = useState([])

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

    useEffect(() => {
        fetch("/api/roles")
        .then(res => res.json())
        .then(data => {
            const formattedRoles = data.map(role => ({
                id: role.role,
                name: role.role
            }))
            setRoles(formattedRoles)
        })

    }, [])


    const statusOptions = [
        {
            id: '',
            name: 'All'
        },
        ...status,
    ]

    const rolesOptions = [
        {
            id: '',
            name: 'All'
        },
        ...roles,
    ]

    return(
        <Container fit='fullwidth'>

            <div className={styles['container-child']}>
                    <Input
                        label='Search User:'
                        name='user'
                        placeholder='Username, email, etc...'
                        onChange={(e) => {
                            setQuery(prev => ({
                                ...prev,
                                search: e.target.value,
                                page: 1
                            }))
                        }}
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
                        label='User Role:'
                        type='select'
                        name='role'
                        value={query.role}
                        values={rolesOptions}
                        onChange={(e) => {
                            setQuery(prev => ({
                                ...prev,
                                role: e.target.value,
                                page: 1
                            }))
                        }}
                        placeholder='Username, email, etc...'
                        size='sm'
                    ></Input>

                    <Input
                        label='Account Status:'
                        name='status'
                        type='select'
                        values={statusOptions}
                        value={query.status}
                        onChange={(e) => {
                            setQuery(prev => ({
                                ...prev,
                                status: e.target.value,
                                page: 1
                            }))
                        }}
                        placeholder='Username, email, etc...'
                        size='sm'
                    ></Input>

                </div>
            
        </Container>
    )
}

