'use client'
import styles from './page.module.scss'
import ProposalsCard from './components/ProposalsCard.js'
import ProposalSearch from './components/ProposalSearch.js'
import Container from '@/components/layout/Container/Container.js'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout.js'
import {useState, useEffect} from 'react'

export default function CreateProposal(){
    const [proposals, setProposals] = useState([])

    const formatDate = (date) => {
    if (!date) return null;

    const d = new Date(date);

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    }

    useEffect(() => {
        fetch('/api/proposals')
        .then(res => res.json())
        .then(data => {
            const allProposals = data.map(proposal => ({
                proposalId: proposal.proposalId,
                slug: proposal.slug,
                clientId: proposal.clientId,
                proposalTitle: proposal.proposalTitle,
                proposalStatus: proposal.proposalStatus.status,
                proposalType: proposal.proposalType,
                dateCreated: formatDate(proposal.dateCreated),
                statusUpdated: formatDate(proposal.statusUpdated),
                clientName: proposal.clientProfile.user.firstName + ' ' + proposal.clientProfile.user.lastName,
                clientEmail: proposal.clientProfile.user.userEmail
            }))
            console.log(allProposals)
            setProposals(allProposals)
            
        })
    }, [])

    return(

        <ChildLayout>
            <ProposalSearch/>
    
            <Container>
                
                <div className={styles['card-container']}>
                    {proposals.map(p => (
                        <ProposalsCard
                            key={p.proposalId}
                            title={p.proposalTitle}
                            slug={p.slug}
                            type={p.proposalType}
                            dateCreated={p.dateCreated}
                            statusUpdateDate={p.statusUpdated}
                            client={p.clientName}
                            clientEmail={p.clientEmail}
                            status={p.proposalStatus}
                        />
                    ))}
        
                </div>
            </Container>

            


        </ChildLayout>
        
    )
}