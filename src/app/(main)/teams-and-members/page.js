'use client'
import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container.js'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout.js'
import MemberCard from '@/components/ui/member-card/MemberCard.js'
import SearchMember from './components/SearchMember'
import FilterDropdown from '@/components/ui/filter-dropdown/FilterDropdown'
import Pagination from '@/components/ui/pagination/Pagination'
import { buildQueryString } from '@/modules/buildQueryString'
import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'

export default function MembersPage(){

    const router = useRouter();
    const [members, setMembers] = useState([])
    const [metaData, setMetaData] = useState({
        totalResults: 0,
        currentPage: 1,
        totalPages:0,
        limit: 20,
    })

    const [query, setQuery] = useState({
        search: "",
        page: 1,
        limit: 20,
        status: "",
        sortBy: "dateCreated",
        sortOrder: 'desc'
    });

    useEffect(() => {
        fetch(`/api/members?${buildQueryString(query)}`)
        .then(res => res.json())
        .then(results => {
            const allMembers = results.data.map(member => ({
                id: member.memberId,
                memberImage: member.memberImage,
                memberName: member.memberName,
                memberRole: member.memberRole,
                description: member.description 
            }))
            const meta = results.meta
            setMetaData({
                totalResults: meta.total,
                currentPage: meta.page,
                totalPages: meta.totalPages,
                limit: meta.limit
            })
            setMembers(allMembers)
        })
    }, [query.search,
        query.page,
        query.status,
        query.sortBy,
        query.sortOrder])

    const start =
    (metaData.currentPage - 1) * metaData.limit + 1;

    const end = Math.min(
    metaData.currentPage * metaData.limit,
    metaData.totalResults
    );

    const deleteMember = async (memberId) => {
        try {
            const res = await fetch(`/api/members/${memberId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete member')
            setMembers(prev => prev.filter(m => m.id !== memberId))
        } catch (err) {
            console.error('Delete member error:', err)
        }
    }

    return(
        <ChildLayout>
                 <SearchMember query={query} setQuery={setQuery}/>
            <Container>
               <div className={styles['results-header']}>

                    <p className={styles['results-count']}>Showing Results: {`${start} - ${end}`} of {metaData.totalResults}</p>

                    <FilterDropdown
                        query={query}
                        setQuery={setQuery}
                        alphabeticalOrderBy={'memberName'}
                    />
                </div>
                <hr></hr>
                <div className={styles['member-container']}>

                    {members.map((m, i) => (
                        <MemberCard
                            key={i}
                            image={m.memberImage}
                            name={m.memberName}
                            role={m.memberRole}
                            description={m.description}
                            onClick={() => router.push(`teams-and-members/${m.id}`)}
                            onDelete={(e) => { e.stopPropagation(); deleteMember(m.id) }}
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