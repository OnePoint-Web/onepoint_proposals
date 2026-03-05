"use client"
import styles from './HeaderProfile.module.scss'
import {useAuth} from '@/context/AuthContext'


export default function HeaderProfile() {
    
    const {user} = useAuth()
    return(
        <div className={styles['header-profile-container']}>
            <div className={styles['icon-container']}>
                    
            </div>

            <p>Welcome back</p>

        </div>
    )
}