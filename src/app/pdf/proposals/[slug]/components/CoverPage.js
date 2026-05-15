import styles from './components.module.scss'

export default function CoverPage({proposal}){
    return(
        <div className={styles.section}>
            <div className={styles.head}>
                <p className={styles['head-title']}>Proposal Document</p>
                <p className={styles['head-title']}><span>Professional Business Proposal</span></p>
            </div> 
            <div className={styles.body}>
                <p>BUSINESS PROPOSAL</p>
                <p className={styles.title}>PARTNERSHIP PROGRAM</p>
                <hr></hr>

              
                
            </div>
            <div className={styles['head-footer']}>
                <p>{proposal.clientProfile.companyName}</p>
                <p>{proposal.clientProfile.user.firstName + ' ' + proposal.clientProfile.user.lastName}</p>
            </div>
        </div>
    )
}