import styles from './FilterDropdown.module.scss'

export default function FilterDropdown({query, setQuery, alphabeticalOrderBy}){
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
            <option value={`${alphabeticalOrderBy}-asc`}>A-Z</option>
            <option value={`${alphabeticalOrderBy}-desc`}>Z-A</option>
        </select>
    )
}

