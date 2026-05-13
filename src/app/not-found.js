'use client'
import styles from './not-found.module.scss'
import {Icons} from '@/components/icons/icons'
import Button from '@/components/ui/button/Button'
import {useRouter} from 'next/navigation'

const ConstructionIcon = Icons.construction

export default function NotFound() {

  const router = useRouter()
  return (
    <div className={styles['not-found-main']}>

        <div className={styles['content-container']}>
            <ConstructionIcon className={styles['icon']}/>
            <h1>404 - Page Not Found</h1>
            <p>The website is currently a work in progress. Some pages you may be looking for might still be unpublished. </p>
            <Button
              size='small'
              label='Return to Dashboard'
              color='red'
              onClick={() => router.push('/')}
            />
        </div>
     
    </div>
  )
}