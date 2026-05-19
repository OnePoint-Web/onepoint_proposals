import styles from './components.module.scss'

const formatDate = (date) => {
    const formatted = new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    }).format(new Date(date));

    return formatted
}

const formatToDateOnly = (date) => {
    const formatted = new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    }).format(new Date(date));

    return formatted
}

export default function CoverPage({proposal}){
    return(
        <div className={styles.section}>
            <div className={styles.head}>
                <p className={styles['head-title']}>Proposal Document</p>
                <p className={styles['head-title']}><span>Professional Business Proposal</span></p>
            </div> 
            <div className={styles['cover-body']}>
                <p className={styles['title-head']}>BUSINESS PROPOSAL</p>
                <p className={styles.title}>PARTNERSHIP PROGRAM</p>
                <hr></hr>
                
                <p className={styles['cover-description']}>
                    This proposal outlines the recommended solutions, scope of work, deliverables, timeline, and investment details tailored to meet the client’s business needs and objectives.
                </p>

                <div className={`${styles['client-information']} ${styles['top']}`}>

                    <div className={styles['client-info-box']}>
                        

                        <p>CLIENT</p>
                        <p>{`${proposal.clientProfile.user.firstName} ${proposal.clientProfile.user.lastName}`}</p>
                    </div>

                    <div className={styles['client-info-box']}>
                    

                        <p>COMPANY</p>
                        <p>{`${proposal.clientProfile.companyName}`}</p>
                    </div>


                </div>

                <div className={styles['client-information']}>

                    <div className={styles['client-info-box']}>

                        <p>DATE CREATED</p>
                        <p>{formatToDateOnly(proposal.dateCreated)}</p>
                    </div>

                </div>
 
              
                
            </div>
            <div className={styles['head-footer']}>
                <p>PROPOSAL DOCUMENT GENERATED - {formatDate(proposal.dateCreated)}</p>
            </div>
        </div>
    )
}