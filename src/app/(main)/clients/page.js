'use client'

import styles from './page.module.scss'
import ChildLayout from "@/components/layout/ChildLayout/ChildLayout"
import Container from "@/components/layout/Container/Container"
import TableList from "@/components/ui/TableList/TableList.js"
import FilterDropdown from '@/components/ui/filter-dropdown/FilterDropdown'
import Pagination from '@/components/ui/pagination/Pagination'
import { buildQueryString } from '@/modules/buildQueryString'
import ClientSearch from "./components/ClientSearch"
import {useEffect, useState} from 'react'

export default function Clients(){

    const [clients, setClients] = useState([])

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

    const start =
    (metaData.currentPage - 1) * metaData.limit + 1;

    const end = Math.min(
    metaData.currentPage * metaData.limit,
    metaData.totalResults
    );

    useEffect(() => {
        fetch(`/api/clients?${buildQueryString(query)}`)
        .then(res => res.json())
        .then(results => {
            const formattedClients = results.data.map(client => ({
                userId: client.userId,
                username: client.username,
                name: client.firstName + ' ' + client.lastName,
                userEmail: client.userEmail,
                companyName: client.clientProfile?.companyName ?? '—',
                accountStatus: client.userStatus?.status ?? '—',
                dateCreated: new Date(client.dateCreated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
            }))

            const meta = results.meta
            setClients(formattedClients)
            setMetaData({
                totalResults: meta.total,
                currentPage: meta.page,
                totalPages: meta.totalPages,
                limit: meta.limit
            })
        })
    }, [query.search,
        query.page,
        query.status,
        query.sortBy,
        query.sortOrder])

    return(
        <ChildLayout>
            <ClientSearch query={query} setQuery={setQuery}/>
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
                        {fieldName: 'Username', key: 'username', span: '15%'},
                        {fieldName: 'Name', key: 'name', span: '20%'},
                        {fieldName: 'Email', key: 'userEmail', span: '15%'},
                        {fieldName: 'Company', key: 'companyName', span: '20%'},
                        {fieldName: 'Status', key: 'accountStatus', span: '10%'},
                        {fieldName: 'Date Created', key: 'dateCreated', span: '20%'},

                    ]}
                data={clients}
                idKey='userId'
                linkTo='/clients/'
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