import styles from './layout.module.scss'
import ProposalSearch from './components/ProposalSearch'
export default function Layout({children}){
    return(
        <div className={styles['subpage-layout']}>
            <ProposalSearch/>
            {children}
        </div>
    )
}