'use client'
import styles from './page.module.scss'
import ProposalsCard from './components/ProposalsCard.js'
import ProposalSearch from './components/ProposalSearch.js'
import Container from '@/components/layout/Container/Container.js'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout.js'
import FilterDropdown from '@/components/ui/filter-dropdown/FilterDropdown'
import Pagination from '@/components/ui/pagination/Pagination'
import { buildQueryString } from '@/modules/buildQueryString'
import {useState, useEffect} from 'react'

export default function CreateProposal(){

    const [proposals, setProposals] = useState([])
    const [metaData, setMetaData] = useState({
        totalResults: 0,
        currentPage: 1,
        totalPages:0,
        limit: 12,
    })

    const [query, setQuery] = useState({
        search: "",
        page: 1,
        limit: 12,
        status: "",
        type: "",
        sortBy: "dateCreated",
        sortOrder: 'desc'
    });

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

        const handler = setTimeout(() => {
            fetch(`/api/proposals?${buildQueryString(query)}`)
            .then(res => res.json())
            .then(result => {
                const allProposals = result.data.map(proposal => ({
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

                const meta = result.meta
                setMetaData({
                    totalResults: meta.total,
                    currentPage: meta.page,
                    totalPages: meta.totalPages,
                    limit: meta.limit
                })
                setProposals(allProposals)  
                
            })
        }, 300)
        return () => clearTimeout(handler);
        
    }, [query.search,
        query.page,
        query.status,
        query.type,
        query.sortBy,
        query.sortOrder]
    )

    const start =
    (metaData.currentPage - 1) * metaData.limit + 1;

    const end = Math.min(
    metaData.currentPage * metaData.limit,
    metaData.totalResults
    );

    return(

        <ChildLayout>
            <ProposalSearch
                query={query}
                setQuery={setQuery}
            />
    
            <Container>
                <div className={styles['results-header']}>

                    <p className={styles['results-count']}>Showing Results: {`${start} - ${end}`} of {metaData.totalResults}</p>

                    <FilterDropdown
                        query={query}
                        setQuery={setQuery}
                    />
                </div>

                <hr></hr>

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


                <Pagination
                    totalPages={metaData.totalPages}
                    currentPage={metaData.currentPage}
                    setPage={setQuery}
                />
            </Container>

            


        </ChildLayout>
        
    )
}