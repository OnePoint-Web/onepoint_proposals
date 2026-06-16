"use client"
import styles from './ProposalsCard.module.scss'
import Button from '@/components/ui/button/Button.js'
import {useRouter} from 'next/navigation'
import {Icons} from '@/components/icons/icons.js'



export default function ProposalsCard(
    {   
        id,
        title,
        dateCreated,
        statusUpdateDate,
        type,
        slug,
        clientId,
        client,
        clientEmail,
        status,
    }
){

    const router = useRouter();
    const classStatus = status.toLowerCase();

    return(
        <div className={styles['proposals-card']}>

            <div className={styles.header}>
                <h3>{title}</h3>
                <p>{type}</p>
            </div>
            
            <hr></hr>

            <div className={styles['details-container']}>
                <div className={`${styles['container-child']} ${styles.one}`}>
                    <p>Created: <span>{dateCreated}</span></p>

                    {status === 'Approved' && (
                        <p>Approved: <span>{statusUpdateDate}</span></p>
                    )}
                    
                </div>

                <div className={`${styles['container-child']} ${styles.two}`}>
                    <p>{client}</p>
                    <p>{clientEmail}</p>
                </div>
            </div>

            <div className={styles['status-container']}>

                <div className={`${styles.status} ${styles[classStatus]}`}>{status}</div>

                <button
                    className={styles['pdf-button']}
                    onClick={(e) => { e.stopPropagation(); window.open(`/api/proposals/${slug}/pdf`, '_blank') }}
                >
                    Generate PDF
                </button>
            </div>

            <Button
                label='View Proposal'
                onClick={() => router.push(`/proposals/${slug}`)}
                color='dark'
                fit='full'
                size='xxs'
            />

        </div>
    )
}