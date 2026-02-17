"use client"

import styles from './ProposalsCard.module.scss'
import Button from '../../../components/ui/button/Button.js'


export default function ProposalsCard(
    {   
        id,
        title,
        dateCreated,
        statusUpdateDate,
        type,
        clientId,
        client,
        clientEmail,
        status,
    }
){

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

                    {
                        statusUpdateDate && (<p>Approved: <span>{statusUpdateDate}</span></p>)
                        
                    }
                    
                </div>

                <div className={`${styles['container-child']} ${styles.two}`}>
                    <p>{client}</p>
                    <p>{clientEmail}</p>
                </div>
            </div>

            <div className={styles['status-container']}>

                <div className={`${styles.status} ${styles[classStatus]}`}>{status}</div>

                <button className={styles['pdf-button']}>
                    Generate PDF
                </button>
            </div>

            <Button
                label='View Proposal'
                color='dark'
                fit='full'
                size='xxs'
            />

        </div>
    )
}