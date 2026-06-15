"use client"
import Form, { FormInputContainer } from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import styles from './ClientEditForm.module.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function ClientEditForm() {
    const { id } = useParams()

    const [client, setClient] = useState(null)
    const [statuses, setStatuses] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        userEmail: '',
        statusId: '',
        companyName: '',
        companyEmail: '',
        companyAddress: '',
        website: '',
    })

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const field = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

    useEffect(() => {
        Promise.all([
            fetch(`/api/clients/${id}`).then(r => r.json()),
            fetch('/api/user-status').then(r => r.json()),
            fetch('/api/auth/me').then(r => r.json()),
        ]).then(([clientData, statusData, meData]) => {
            const c = clientData.data
            setClient(c)
            setForm({
                firstName: c.firstName ?? '',
                lastName: c.lastName ?? '',
                userEmail: c.userEmail ?? '',
                statusId: String(c.accountStatus ?? ''),
                companyName: c.clientProfile?.companyName ?? '',
                companyEmail: c.clientProfile?.companyEmail ?? '',
                companyAddress: c.clientProfile?.companyAddress ?? '',
                website: c.clientProfile?.website ?? '',
            })
            setStatuses(statusData.map(s => ({ id: String(s.statusId), name: s.status })))
            setCurrentUser(meData.user)
            setLoading(false)
        })
    }, [id])

    const isSuperAdmin = currentUser?.accountRole === 1

    const handleSave = async () => {
        setError('')
        setSuccess('')
        setPasswordError('')

        if (newPassword && newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match')
            return
        }
        if (newPassword && newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters')
            return
        }

        setSaving(true)
        try {
            const body = {
                statusId: Number(form.statusId),
                firstName: form.firstName,
                lastName: form.lastName,
                userEmail: form.userEmail,
                companyName: form.companyName,
                companyEmail: form.companyEmail,
                companyAddress: form.companyAddress,
                website: form.website,
            }
            if (newPassword) body.newPassword = newPassword

            const res = await fetch(`/api/clients/${id}`, {
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
            setClient(prev => ({ ...prev, ...result.updated }))
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p style={{ padding: '20px' }}>Loading…</p>
    if (!client) return <p style={{ padding: '20px' }}>Client not found.</p>

    return (
        <Form header='Client Profile' description=''>

            <fieldset className={styles['field-set']}>

                <FormInputContainer label='Username'>
                    <Input label='Username' width="medium" hideLabel disabled value={client.username} onChange={() => {}} />
                </FormInputContainer>

                <FormInputContainer label='Date Created'>
                    <Input label='Date Created' width="medium" hideLabel disabled
                        value={new Date(client.dateCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        onChange={() => {}} />
                </FormInputContainer>

            </fieldset>

            <hr />

            <fieldset className={styles['field-set']}>
                <h3>Personal Details</h3>

                <FormInputContainer label='First Name'>
                    <Input label='First Name' hideLabel width="medium" value={form.firstName} onChange={field('firstName')} />
                </FormInputContainer>

                <FormInputContainer label='Last Name'>
                    <Input label='Last Name' hideLabel width="medium" value={form.lastName} onChange={field('lastName')} />
                </FormInputContainer>

                <FormInputContainer label='Email'>
                    <Input label='Email' hideLabel width="medium" type='email' value={form.userEmail} onChange={field('userEmail')} />
                </FormInputContainer>

                <FormInputContainer label='Account Status'>
                    <Input
                        label='Account Status'
                        type='select'
                        hideLabel
                        width="medium"
                        values={statuses}
                        value={form.statusId}
                        onChange={field('statusId')}
                    />
                </FormInputContainer>

            </fieldset>

            <hr />

            <fieldset className={styles['field-set']}>
                <h3>Company Details</h3>

                <FormInputContainer label='Company Name'>
                    <Input label='Company Name' hideLabel width="medium" value={form.companyName} onChange={field('companyName')} />
                </FormInputContainer>

                <FormInputContainer label='Company Email'>
                    <Input label='Company Email' hideLabel width="medium" type='email' value={form.companyEmail} onChange={field('companyEmail')} />
                </FormInputContainer>

                <FormInputContainer label='Company Address'>
                    <Input label='Company Address' hideLabel width="medium" value={form.companyAddress} onChange={field('companyAddress')} />
                </FormInputContainer>

                <FormInputContainer label='Website'>
                    <Input label='Website' hideLabel width="medium" value={form.website} onChange={field('website')} />
                </FormInputContainer>

            </fieldset>

            {isSuperAdmin && (
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
