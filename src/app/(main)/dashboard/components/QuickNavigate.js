import styles from './dashboard.module.scss'
import { Icons } from '@/components/icons/icons'
import Link from 'next/link'

const NAV_ITEMS = [
    { label: 'Create Proposal', href: '/proposals/create-proposal', icon: Icons.proposals },
    { label: 'Add New Package', href: '/packages/create-package',   icon: Icons.packages  },
    { label: 'Create Product',  href: '/products/create-product',   icon: Icons.products  },
    { label: 'Create Service',  href: '/services/create-service',   icon: Icons.services  },
    { label: 'Add Client',      href: '/clients/create-client',     icon: Icons.clients   },
]

export default function QuickNavigate() {
    return (
        <div className={styles.section}>
            <div className={styles['section-header']}>
                <h2>Quick Navigate</h2>
            </div>

            <div className={styles['quick-nav-grid']}>
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon
                    return (
                        <Link key={item.href} href={item.href} className={styles['quick-nav-card']}>
                            <Icon className={styles['nav-icon']} />
                            <span className={styles['nav-label']}>{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
