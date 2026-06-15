"use client"
import styles from './HeaderProfile.module.scss'
import { useAuth } from '@/context/AuthContext'
import { Icons } from '@/components/icons/icons.js'
import { RiSettings4Line, RiUserLine, RiLogoutBoxLine } from 'react-icons/ri'
import { useState, useRef } from 'react'
import useMouseClickOut from '@/hooks/useMouseClickOut.js'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import Link from 'next/link'

export default function HeaderProfile() {

    const { user, onLogout } = useAuth()
    const router = useRouter()
    const NotificationIcon = Icons.notification

    const [notifOpen, setNotifOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const [notifications, setNotifications] = useState([])

    const notifRef = useRef()
    const profileRef = useRef()

    useMouseClickOut(notifRef, () => setNotifOpen(false))
    useMouseClickOut(profileRef, () => setProfileMenuOpen(false))

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

    // Fetch on mount so the badge count is visible immediately
    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    // Refresh when panel is opened
    useEffect(() => {
        if (notifOpen) fetchNotifications()
    }, [notifOpen, fetchNotifications])

    const handleNotificationClick = async (notification) => {
        try {
            await fetch(`/api/notifications/${notification.notificationId}`, { method: 'PATCH' })
            setNotifications(prev =>
                prev.filter(n => n.notificationId !== notification.notificationId)
            )
        } catch {
            // mark-read failed silently — still navigate
        }
        setNotifOpen(false)
        router.push(`/${notification.entityType}/${notification.entityId}`)
    }

    const initials = user
        ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
        : ''

    const unreadCount = notifications.length

    return (
        <div className={styles['header-element-container']}>

            {/* Notifications */}
            <div ref={notifRef} className={styles['icon-container']}>
                <div className={styles['notif-icon-wrapper']}>
                    <NotificationIcon
                        className={styles['notif-icon']}
                        onClick={() => setNotifOpen(prev => !prev)}
                    />
                    {unreadCount > 0 && (
                        <span className={styles['notif-badge']}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>

                <div className={`${styles['notification-container']} ${notifOpen ? styles.active : ''}`}>
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

            {/* Profile card */}
            <div ref={profileRef} className={styles['profile-wrapper']}>
                <div className={styles['profile-container']}>
                    <div className={styles['profile']}>
                        <span>{initials}</span>
                    </div>
                    <p>Welcome back, {user && <span>{user.lastName}!</span>}</p>
                    <button
                        className={styles['settings-btn']}
                        onClick={() => setProfileMenuOpen(prev => !prev)}
                        aria-label="Account settings"
                    >
                        <RiSettings4Line className={styles['settings-icon']} />
                    </button>
                </div>

                <div className={`${styles['profile-menu']} ${profileMenuOpen ? styles.active : ''}`}>
                    <Link
                        href={`/users/${user?.userId}`}
                        className={styles['profile-menu-item']}
                        onClick={() => setProfileMenuOpen(false)}
                    >
                        <RiUserLine className={styles['menu-icon']} />
                        My Profile
                    </Link>
                    <hr className={styles['menu-divider']} />
                    <button
                        className={`${styles['profile-menu-item']} ${styles['logout']}`}
                        onClick={onLogout}
                    >
                        <RiLogoutBoxLine className={styles['menu-icon']} />
                        Logout
                    </button>
                </div>
            </div>

        </div>
    )
}
