"use client"
import styles from './HeaderProfile.module.scss'
import {useAuth} from '@/context/AuthContext'
import {Icons} from '@/components/icons/icons.js'
import {useState, useRef} from 'react'
import useMouseClickOut from '@/hooks/useMouseClickOut.js'

export default function HeaderProfile() {
    
    const {user} = useAuth()
    const NotificationIcon = Icons.notification
    const [isActive, setIsActive] = useState(false)

    const ref = useRef()
    useMouseClickOut(ref, () => setIsActive(false))

    const toggleNotification = isActive ? 'active' : '';
    console.log(toggleNotification)

    return(

        
        <div className={styles['header-element-container']}>

            <div className={styles['icon-container']}>
                    <NotificationIcon 
                        className={styles['notif-icon']}
                        onClick={() => setIsActive(prev => !prev)}    
                    />

                    <div 
                    ref={ref}                    
                    className={`${styles['notification-container']} ${styles[toggleNotification]}`}
                    >
                        <h3>Notifications</h3>
                        <hr></hr>
                    </div>
            </div>

            <div className={styles['profile-container']}>
                <div className={styles['profile']}></div>
                <p>Welcome back, {user && <span>{user.lastName}!</span>}</p>
            </div>
            
        </div>
    )
}