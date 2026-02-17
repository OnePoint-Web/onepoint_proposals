import styles from './ProposalSearch.module.scss'
import Input from '../../../components/ui/input/Input.js'

export default function ProposalSearch(){
    return (
        <div className={styles['proposal-search-main']}>
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
                        Create Proposal
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
            
        </div>
    )
}