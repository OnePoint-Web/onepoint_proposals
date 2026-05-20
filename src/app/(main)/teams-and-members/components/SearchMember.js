import styles from './SearchMember.module.scss'
import Container from '@/components/layout/Container/Container';
import Input from '@/components/ui/input/Input';
import {Icons} from '@/components/icons/icons.js'
import {useEffect, useState} from 'react'
import Link from 'next/link'

const MemberIcon = Icons.teamIcon


export default function SearchMember({query, setQuery}){
    return(
        <Container fit='fullwidth'>

            <div className={styles['container-child']}>
                    <Input
                        label='Search Member:'
                        name='user'
                        placeholder='Member Name, Position...'
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
                        <Link className={styles['link-btn']} href='/teams-and-members/add-member'>
                            <MemberIcon className={styles.icon}/> Create Member
                        </Link>
                    </div>
                </div>


        </Container>
    )
}