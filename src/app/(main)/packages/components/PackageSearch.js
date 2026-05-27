import styles from './PackageSearch.module.scss'
import Input from '@/components/ui/input/Input.js'
import Container from '@/components/layout/Container/Container.js'
import {useRouter} from 'next/navigation'
import {Icons} from '@/components/icons/icons.js'

export default function PackageSearch({query, setQuery}){
    const ProposalsIcon = Icons.proposals
    const router = useRouter()
    return(
        <Container fit="fullwidth">
            <div className={styles['search-section']}>
                <Input
                    label='Search Packages:'
                    name='package'
                    placeholder='Package name...'
                    width='full'
                    value={query.search}
                    onChange={(e)=>{
                        setQuery(prev => ({
                            ...prev,
                            search: e.target.value,
                            page: 1
                        }))
                    }}
                />

                <div className={styles['button-container']}>
                    <label>____</label>
                    <button
                        onClick={() => router.push(`/packages/create-package`)}
                    >
                        <ProposalsIcon className={styles.icon}/> Create Package
                    </button>
                </div>
                
            </div>

            <div className={styles['search-section']}>

                <Input
                    type='select'
                    label='Proposal Status'
                    value={query.status}
                    values={[
                        {id: '', name: 'All'},
                        {id: 'true', name: 'Active'},
                        {id: 'false Proposal', name: 'Inactive'}
                    ]}
                    onChange={(e)=>{
                        setQuery(prev => ({
                            ...prev,
                            status: e.target.value,
                            page: 1,
                        }))
                    }}
                    name='proposal'
                    placeholder='Proposal Type'
                />

               
            </div>
            
        </Container>
    )
}