import styles from './page.module.scss'
import ProposalsCard from './components/ProposalsCard.js'


export default function CreateProposal({display}){
    return(
        <div className={` ${styles['page-container']} ${display}`}>

            <div className={styles['card-container']}>
                <ProposalsCard
                    title='FNCAquatics - Partnership Program'
                    type='SLA Package'
                    dateCreated='11/02/2026'
                    statusUpdateDate='12/04/2026'
                    client='Francis Norman'
                    clientEmail='fnc1pt@gmail.com'
                    status='Approved'
                />
                <ProposalsCard
                    title="FNCAquatics – Supply Agreement"
                    type="SLA Package"
                    dateCreated="01/28/2026"
                    statusUpdateDate="02/01/2026"
                    client="Mark Villanueva"
                    clientEmail="mark.v@example.com"
                    status="Declined"
                />
                <ProposalsCard
                    title="FNCAquatics – Retail Partnership"
                    type="SLA Package"
                    dateCreated="02/02/2026"
                    
                    client="Angela Reyes"
                    clientEmail="angela.r@example.com"
                    status="Published"
                />
                <ProposalsCard
                    title="FNCAquatics – Maintenance Services"
                    type="SLA Package"
                    dateCreated="02/05/2026"
                    statusUpdateDate="02/06/2026"
                    client="Joshua Lim"
                    clientEmail="joshua.lim@example.com"
                    status="Pending"
                />

                <ProposalsCard
                    title="FNCAquatics – Aquarium Setup Proposal"
                    type="Custom Proposal"
                    dateCreated="02/07/2026"
                    statusUpdateDate="02/07/2026"
                    client="Internal"
                    clientEmail="—"
                    status="Draft"
                />

                <ProposalsCard
                    title="FNCAquatics – Long-Term Service Contract"
                    type="SLA Package"
                    dateCreated="02/08/2026"
                    statusUpdateDate="02/09/2026"
                    client="Paolo Santos"
                    clientEmail="paolo.s@example.com"
                    status="Viewed"
                />



            </div>
        </div>
    )
}