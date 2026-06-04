"use client"
import styles from './HeaderProfile.module.scss'
import {useAuth} from '@/context/AuthContext'
import {Icons} from '@/components/icons/icons.js'
import {useState, useRef, useEffect, useCallback} from 'react'
import useMouseClickOut from '@/hooks/useMouseClickOut.js'
import {useRouter} from 'next/navigation'

export default function HeaderProfile() {

    const {user} = useAuth()
    const router = useRouter()
    const NotificationIcon = Icons.notification

    const [isActive, setIsActive] = useState(false)
    const [notifications, setNotifications] = useState([])

    const ref = useRef()
    useMouseClickOut(ref, () => setIsActive(false))

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch('/api/notifications')
            if (!res.ok) return
            const data = await res.json()
            setNotifications(data.data ?? [])
        } catch {
            // silently fail — non-critical
        }
    }, [])

    useEffect(() => {
        if (isActive) fetchNotifications()
    }, [isActive, fetchNotifications])

    const handleNotificationClick = async (notification) => {
        try {
            await fetch(`/api/notifications/${notification.notificationId}`, { method: 'PATCH' })
            setNotifications(prev =>
                prev.filter(n => n.notificationId !== notification.notificationId)
            )
        } catch {
            // mark-read failed silently — still navigate
        }
        setIsActive(false)
        router.push(`/${notification.entityType}/${notification.entityId}`)
    }

    const unreadCount = notifications.length

    return (
        <div className={styles['header-element-container']}>

            <div
                ref={ref}
                className={styles['icon-container']}
            >
                <div className={styles['notif-icon-wrapper']}>
                    <NotificationIcon
                        className={styles['notif-icon']}
                        onClick={() => setIsActive(prev => !prev)}
                    />
                    {unreadCount > 0 && (
                        <span className={styles['notif-badge']}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>

                <div className={`${styles['notification-container']} ${isActive ? styles.active : ''}`}>
                    <h3>Notifications</h3>
                    <hr />

                    {notifications.length === 0 ? (
                        <p className={styles['notif-empty']}>No new notifications</p>
                    ) : (
                        <ul className={styles['notif-list']}>
                            {notifications.map(n => (
                                <li
                                    key={n.notificationId}
                                    className={styles['notif-item']}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <span className={styles['notif-title']}>{n.title}</span>
                                    <span className={styles['notif-message']}>{n.message}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className={styles['profile-container']}>
                <div className={styles['profile']}></div>
                <p>Welcome back, {user && <span>{user.lastName}!</span>}</p>
            </div>

        </div>
    )
}
