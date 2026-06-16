import styles from './ProposalSearch.module.scss'
import Input from '@/components/ui/input/Input.js'
import Container from '@/components/layout/Container/Container.js'
import {Icons} from '@/components/icons/icons.js'
import { useRouter } from 'next/navigation'


export default function ProposalSearch({query, setQuery}){

    const ProposalsIcon = Icons.proposals
    const router = useRouter()

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
                    <button onClick={() => router.push('/proposals/create-proposal')}>
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
                        {id: '', name: 'All'},
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
                        {id: 'Draft', name: 'Draft'},
                        {id: 'Published', name: 'Published'},
                        {id: 'Sent', name: 'Sent'},
                        {id: 'Viewed', name: 'Viewed'},
                        {id: 'Approved', name: 'Approved'},
                        {id: 'Declined', name: 'Declined'},
                    ]}
                    onChange={(e)=>{
                        setQuery(prev => ({
                            ...prev,
                            status: e.target.value,
                            page: 1,
                        }))
                    }}
                    name='proposal'
                    placeholder='Proposal Status'
                />


            </div>

        </Container>
    )
}