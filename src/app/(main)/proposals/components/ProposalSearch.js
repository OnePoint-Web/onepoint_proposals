import styles from './ProposalSearch.module.scss'
import Input from '@/components/ui/input/Input.js'
import Container from '@/components/layout/Container/Container.js'
import {Icons} from '@/components/icons/icons.js'

export default function ProposalSearch(){

    const ProposalsIcon = Icons.proposals
    
    return (
      <Container fit="fit">
            <div className={styles['search-section']}>
                <Input
                    label='Search Proposals:'
                    name='proposal'
                    placeholder='Proposal title, company name, client'
                    width='full'
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
                    label='Search Proposals:'
                    name='proposal'
                    placeholder='Proposal title, company name, client'
                />

                <Input
                    type='select'
                    label='Select Filter'
                    name='proposal'
                    placeholder='Proposal Type'
                    values={['Where', 'who', 'when']}
                />

                <Input
                    label='Search Proposals:'
                    name='proposal'
                    placeholder='Proposal title, company name, client'
                />
            </div>
            
        </Container>//
    )
}