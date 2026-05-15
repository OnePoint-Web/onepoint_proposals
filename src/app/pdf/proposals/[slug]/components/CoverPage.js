import styles from './components.module.scss'

export default function CoverPage(){
    return(
        <>
            <div className={styles.head}>
                <p className={styles['head-title']}>Proposal Document</p>
                <p className={styles['head-title']}><span>Professional Business Proposal</span></p>
            </div> 
        </>
    )
}