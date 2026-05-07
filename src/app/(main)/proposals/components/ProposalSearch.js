import styles from './ProposalSearch.module.scss'
import Input from '@/components/ui/input/Input.js'
import Container from '@/components/layout/Container/Container.js'
import {Icons} from '@/components/icons/icons.js'


export default function ProposalSearch({query, setQuery}){

    const ProposalsIcon = Icons.proposals
    
    return (
      <Container fit="fullwidth">
            <div className={styles['search-section']}>
                <Input
                    label='Search Proposals:'
                    name='proposal'
                    placeholder='Proposal title, company name, client'
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
                    <button>
                        <ProposalsIcon className={styles.icon}/> Create Proposal
                    </button>
                </div>
                
            </div>

            <div className={styles['search-section']}>
                <Input
                    label='Proposal Type:'
                    type='select'
                    name='proposal'
                    placeholder='Proposal title, company name, client'
                    value={query.type}
                    values={[
                        {id: 'SLA Proposal', name: 'SLA Proposal'},
                        {id: 'Service Proposal', name: 'Service Proposal'},
                        {id: 'Product Proposal', name: 'Product Proposal'}
                    ]}
                    onChange={(e)=>{
                        setQuery(prev => ({
                            ...prev,
                            type: e.target.value,
                            page: 1
                        }))
                    }}
                />

                <Input
                    type='select'
                    label='Proposal Status'
                    value={query.status}
                    values={[
                        {id: '', name: 'All'},
                        {id: 'Service Proposal', name: 'Published'},
                        {id: 'Product Proposal', name: 'Sent'}
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
            
        </Container>//
    )
}