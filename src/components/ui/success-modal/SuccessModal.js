
import styles from './SuccessModal.module.scss'

export default function SuccessModal({message, actionMessage, icon}){

    const Icon = icon
    return(
        <div 
            className={`${styles['success-modal-bg']}`} 
        >  

            <div className={styles['success-modal-container']} onClick={(e) => e.stopPropagation()}>
            <Icon className={styles.icon}/>
            <p className={styles.head}>{message}</p>
            <p className={styles.message}>{actionMessage}</p>

            </div>              
        
        </div>  
    )
}

