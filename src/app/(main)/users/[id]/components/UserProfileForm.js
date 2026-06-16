"use client"
import Form, { FormInputContainer } from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import styles from './UserProfileForm.module.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function UserProfileForm() {
    const params = useParams()
    const { id } = params

    const [user, setUser] = useState(null)
    const [statuses, setStatuses] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const [statusId, setStatusId] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    useEffect(() => {
        Promise.all([
            fetch(`/api/users/${id}`).then(r => r.json()),
            fetch('/api/user-status').then(r => r.json()),
            fetch('/api/auth/me').then(r => r.json()),
        ]).then(([userData, statusData, meData]) => {
            setUser(userData.data)
            setStatusId(userData.data?.accountStatus ?? '')
            setStatuses(statusData.map(s => ({ id: s.statusId, name: s.status })))
            setCurrentUser(meData.user)
            setLoading(false)
        })
    }, [id])

    const isSuperAdmin = currentUser?.accountRole === 1
    const isOwnProfile = currentUser?.userId === Number(id)
    const canChangePassword = isSuperAdmin || isOwnProfile

    const handleSave = async () => {
        setError('')
        setSuccess('')
        setPasswordError('')

        if (newPassword && newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match')
            return
        }

        setSaving(true)
        try {
            const body = { statusId: Number(statusId) }
            if (newPassword) body.newPassword = newPassword

            const res = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const result = await res.json()
            if (!res.ok) {
                setError(result.error || 'Failed to save changes')
                return
            }

            setSuccess('Changes saved successfully')
            setNewPassword('')
            setConfirmPassword('')
            setUser(prev => ({ ...prev, accountStatus: result.updated.accountStatus, userStatus: result.updated.userStatus }))
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p style={{ padding: '20px' }}>Loading…</p>
    if (!user) return <p style={{ padding: '20px' }}>User not found.</p>

    return (
        <Form header='User Profile' description=''>

            <fieldset className={styles['field-set']}>

                <FormInputContainer label='Username'>
                    <Input label='Username' width="medium" hideLabel disabled value={user.username} onChange={() => {}} />
                </FormInputContainer>

                <FormInputContainer label='First Name'>
                    <Input label='First Name' width="medium" hideLabel disabled value={user.firstName} onChange={() => {}} />
                </FormInputContainer>

                <FormInputContainer label='Last Name'>
                    <Input label='Last Name' width="medium" hideLabel disabled value={user.lastName} onChange={() => {}} />
                </FormInputContainer>

                <FormInputContainer label='Email'>
                    <Input label='Email' width="medium" hideLabel disabled value={user.userEmail} onChange={() => {}} />
                </FormInputContainer>

                <FormInputContainer label='Role'>
                    <Input label='Role' width="medium" hideLabel disabled value={user.role?.role ?? ''} onChange={() => {}} />
                </FormInputContainer>

                <FormInputContainer label='Date Created'>
                    <Input label='Date Created' width="medium" hideLabel disabled
                        value={new Date(user.dateCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        onChange={() => {}} />
                </FormInputContainer>

            </fieldset>

            <hr />

            <fieldset className={styles['field-set']}>
                <h3>Account Settings</h3>

                <FormInputContainer label='Account Status'>
                    <Input
                        label='Account Status'
                        type='select'
                        hideLabel
                        width="medium"
                        values={statuses}
                        value={String(statusId)}
                        onChange={(e) => setStatusId(e.target.value)}
                    />
                </FormInputContainer>

            </fieldset>

            {canChangePassword && (
                <>
                    <hr />
                    <fieldset className={styles['field-set']}>
                        <h3>Reset Password</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '4px' }}>
                            Leave blank to keep the current password.
                        </p>

                        <FormInputContainer label='New Password'>
                            <Input
                                label='New Password'
                                type='password'
                                hideLabel
                                width="medium"
                                placeholder='New password…'
                                rules={{ value: newPassword, onChange: (e) => setNewPassword(e.target.value) }}
                            />
                        </FormInputContainer>

                        <FormInputContainer label='Confirm Password'>
                            <Input
                                label='Confirm Password'
                                type='password'
                                hideLabel
                                width="medium"
                                placeholder='Confirm new password…'
                                rules={{ value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) }}
                            />
                        </FormInputContainer>

                        {passwordError && <p className={styles.error}>{passwordError}</p>}
                    </fieldset>
                </>
            )}

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <Button
                label={saving ? 'Saving…' : 'Save Changes'}
                size='xs'
                color='dark'
                action='button'
                disabled={saving}
                onClick={handleSave}
            />

        </Form>
    )
}
