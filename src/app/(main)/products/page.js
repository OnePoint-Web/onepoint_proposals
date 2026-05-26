'use client'

import styles from './page.module.scss'
import ProductSearch from './components/ProductSearch'
import Container from '@/components/layout/Container/Container.js'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout.js'
import FilterDropdown from '@/components/ui/filter-dropdown/FilterDropdown'
import Pagination from '@/components/ui/pagination/Pagination'
import { buildQueryString } from '@/modules/buildQueryString'
import { useEffect, useState } from 'react'

export default function Products(){
    const [products, setProducts] = useState([])
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
            fetch(`/api/products?${buildQueryString(query)}`)
                .then(res => res.json())
                .then(result => {
                    setProducts(result.data || [])

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
            <ProductSearch query={query} setQuery={setQuery}/>

            <Container>
                <div className={styles['results-header']}>
                    <p className={styles['results-count']}>Showing Results: {`${start} - ${end}`} of {metaData.totalResults}</p>

                    <FilterDropdown
                        query={query}
                        setQuery={setQuery}
                        alphabeticalOrderBy='product'
                    />
                </div>

                <hr></hr>

                <div className={styles['card-container']}>
                    {products.map(product => (
                        <div className={styles['item-card']} key={product.productId}>
                            <div className={styles.details}>
                                <h4>{product.product}</h4>
                                <p className={styles.price}>$ {product.price}</p>
                                <p className={styles.description}>{product.description}</p>
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
