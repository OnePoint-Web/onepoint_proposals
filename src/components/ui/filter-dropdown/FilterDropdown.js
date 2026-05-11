import styles from './FilterDropdown.module.scss'

export default function FilterDropdown({query, setQuery}){
    return(
        <select
            className={styles['filter-dropdown']}
            value={`${query.sortBy}-${query.sortOrder}`}
            onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')

                setQuery(prev => ({
                ...prev,
                sortBy,
                sortOrder
                }))
            }}
        >
            <option value="dateCreated-desc">Newest</option>
            <option value="dateCreated-asc">Oldest</option>
            <option value="proposalTitle-asc">A-Z</option>
            <option value="proposalTitle-desc">Z-A</option>
        </select>
    )
}

