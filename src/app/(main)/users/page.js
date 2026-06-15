'use client'
import styles from './page.module.scss'
import ChildLayout from "@/components/layout/ChildLayout/ChildLayout"
import Container from "@/components/layout/Container/Container"
import FilterDropdown from '@/components/ui/filter-dropdown/FilterDropdown'
import Pagination from '@/components/ui/pagination/Pagination'
import { buildQueryString } from '@/modules/buildQueryString'
import TableList from "@/components/ui/TableList/TableList.js"
import UserSearch from "./components/UserSearch"
import {useEffect, useState} from 'react'

export default function Users(){

    const [users, setUsers] = useState([])
    const [metaData, setMetaData] = useState({
        totalResults: 0,
        currentPage: 1,
        totalPages:0,
        limit: 20,
    })

    const [query, setQuery] = useState({
        search: '',
        page: 1,
        limit: 20,
        status: '',
        role: '',
        sortBy: 'dateCreated',
        sortOrder: 'desc'
    });

    const start =
        (metaData.currentPage - 1) * metaData.limit + 1;

    const end = Math.min(
        metaData.currentPage * metaData.limit,
        metaData.totalResults
    );

    useEffect(() => {
        fetch(`/api/users?${buildQueryString(query)}`)
        .then(res => res.json())
        .then(result => {
            const formattedUsers = result.data.map(user => ({
                userId: user.userId,
                username: user.username,
                name: user.firstName + ' ' + user.lastName,
                userEmail: user.userEmail,
                accountRole: user.role?.role ?? '—',
                accountStatus: user.userStatus?.status ?? '—',
                dateCreated: new Date(user.dateCreated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
            }))
            const meta = result.meta
            setMetaData({
                totalResults: meta.total,
                currentPage: meta.page,
                totalPages: meta.totalPages,
                limit: meta.limit
            })
            setUsers(formattedUsers)
        })
    }, [query.search,
        query.page,
        query.status,
        query.role,
        query.sortBy,
        query.sortOrder])

    return(
        <ChildLayout>
            <UserSearch query={query} setQuery={setQuery}/>
            <Container>
                <div className={styles['results-header']}>

                    <p className={styles['results-count']}>Showing Results: {`${start} - ${end}`} of {metaData.totalResults}</p>

                    <FilterDropdown
                        query={query}
                        setQuery={setQuery}
                        alphabeticalOrderBy={'username'}
                    />
                </div>

                <TableList 
                fields={
                    [
                        {fieldName: 'ID', key: 'userId', span: 'fit-content'},
                        {fieldName: 'Username', key: 'username', span: '20%'},
                        {fieldName: 'Name', key: 'name', span: '15%'},
                        {fieldName: 'Email', key: 'userEmail', span: '20%'},
                        {fieldName: 'Role', key: 'accountRole', span: '10%'},
                        {fieldName: 'Status', key: 'accountStatus', span: '10%'},
                        {fieldName: 'Date Created', key: 'dateCreated', span: '15%'},

                    ]}
                data={users}
                idKey='userId'
                linkTo={`/users/`}
                />

                <Pagination
                    totalPages={metaData.totalPages}
                    currentPage={metaData.currentPage}
                    setPage={setQuery}
                />
            </Container>
        </ChildLayout>
    )
}