'use client'
import { useState, useEffect } from 'react'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import Container from '@/components/layout/Container/Container'
import StatsSection from './components/StatsSection'
import RecentProposals from './components/RecentProposals'
import QuickNavigate from './components/QuickNavigate'
import RecentActivity from './components/RecentActivity'
import styles from './components/dashboard.module.scss'

export default function Dashboard() {
    const [range, setRange] = useState('month')
    const [stats, setStats] = useState(null)
    const [recentProposals, setRecentProposals] = useState([])

    useEffect(() => {
        fetch(`/api/dashboard/stats?range=${range}`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(console.error)
    }, [range])

    useEffect(() => {
        fetch('/api/proposals?limit=5&sortBy=dateCreated&sortOrder=desc')
            .then(res => res.json())
            .then(result => setRecentProposals(result.data ?? []))
            .catch(console.error)
    }, [])

    return (
        <ChildLayout>
            <Container fit='fullwidth'>
                <div className={styles['dashboard-grid']}>
                    <StatsSection stats={stats} range={range} setRange={setRange} />
                    <RecentProposals proposals={recentProposals} />
                    <QuickNavigate />
                    <RecentActivity />
                </div>
            </Container>
        </ChildLayout>
    )
}
