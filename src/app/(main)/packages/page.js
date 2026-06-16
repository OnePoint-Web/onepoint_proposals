'use client'
import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container.js'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout.js'
import PackageCard from './components/PackageCard'
import PackageSearch from './components/PackageSearch'
import FilterDropdown from '@/components/ui/filter-dropdown/FilterDropdown'
import Pagination from '@/components/ui/pagination/Pagination'
import { buildQueryString } from '@/modules/buildQueryString'
import {useEffect, useState} from 'react'



export default function Packages(){

    const [packages, setPackages] = useState([])
    const [query, setQuery] = useState({
        search: '',
        status: true,
        page: 1,
        orderBy: '',
    })
    const [metaData, setMetaData] = useState({
        totalResults: 0,
        currentPage: 1,
        totalPages:0,
        limit: 12,
    })

    useEffect(() => {
        fetch(`/api/packages?${buildQueryString(query)}`)
        .then(res => res.json())
        .then(results => {
            const allPackages = results.data.map(packageItem => ({
                id: packageItem.packageId,
                slug: packageItem.slug,
                title: packageItem.package,
                description: packageItem.description,
                solution: packageItem.proposedSolution,
                price: packageItem.basePrice
            }))

            const meta = results.meta
            setPackages(allPackages)
            setMetaData({
                    totalResults: meta.total,
                    currentPage: meta.page,
                    totalPages: meta.totalPages,
                    limit: meta.limit
                })
        })
    }, [query.search,
        query.status,
        query.orderBy,
        query.page])

    const start =
    (metaData.currentPage - 1) * metaData.limit + 1;

    const end = Math.min(
    metaData.currentPage * metaData.limit,
    metaData.totalResults
    );

    return(
        <ChildLayout>
            <PackageSearch query={query} setQuery={setQuery}/>
            <Container>

                <div className={styles['results-header']}>

                    <p className={styles['results-count']}>Showing Results: {`${start} - ${end}`} of {metaData.totalResults}</p>

                    <FilterDropdown
                        query={query}
                        setQuery={setQuery}
                        alphabeticalOrderBy={'proposalTitle'}
                    />
                </div>
                <div className={styles['packages-items']}>
                    {packages.map(pkg => (
                        <PackageCard
                            slug={pkg.slug}
                            key={pkg.id}
                            title={pkg.title}
                            price={pkg.price}
                            description={pkg.description}
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