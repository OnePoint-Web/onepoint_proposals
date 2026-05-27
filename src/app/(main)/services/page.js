'use client'

import styles from './page.module.scss'
import ServiceSearch from './components/ServiceSearch'
import Container from '@/components/layout/Container/Container.js'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout.js'
import FilterDropdown from '@/components/ui/filter-dropdown/FilterDropdown'
import Pagination from '@/components/ui/pagination/Pagination'
import { buildQueryString } from '@/modules/buildQueryString'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Services(){
    const [services, setServices] = useState([])
    const [metaData, setMetaData] = useState({
        totalResults: 0,
        currentPage: 1,
        totalPages: 0,
        limit: 12,
    })
    const [query, setQuery] = useState({
        search: '',
        page: 1,
        limit: 12,
        sortBy: 'dateCreated',
        sortOrder: 'desc',
    })

    useEffect(() => {
        const handler = setTimeout(() => {
            fetch(`/api/services?${buildQueryString(query)}`)
                .then(res => res.json())
                .then(result => {
                    setServices(result.data || [])

                    const meta = result.meta || {}
                    setMetaData({
                        totalResults: meta.total || 0,
                        currentPage: meta.page || 1,
                        totalPages: meta.totalPages || 0,
                        limit: meta.limit || 12,
                    })
                })
        }, 300)

        return () => clearTimeout(handler)
    }, [query])

    const start = metaData.totalResults === 0
        ? 0
        : (metaData.currentPage - 1) * metaData.limit + 1
    const end = Math.min(metaData.currentPage * metaData.limit, metaData.totalResults)

    return(
        <ChildLayout>
            <ServiceSearch query={query} setQuery={setQuery}/>

            <Container>
                <div className={styles['results-header']}>
                    <p className={styles['results-count']}>Showing Results: {`${start} - ${end}`} of {metaData.totalResults}</p>

                    <FilterDropdown
                        query={query}
                        setQuery={setQuery}
                        alphabeticalOrderBy='service'
                    />
                </div>

                <hr></hr>

                <div className={styles['card-container']}>
                    {services.map(service => (
                        <div className={styles['item-card']} key={service.serviceId}>
                            <div className={styles.details}>
                                <h4>{service.service}</h4>
                                <p className={styles.price}>$ {service.price}</p>
                                <p className={styles.description}>{service.description}</p>
                            </div>

                            <div className={styles.buttons}>
                                <div className={styles['card-btn']}>
                                    <Link href={`/services/${service.serviceId}`}>
                                        <p>View</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
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
