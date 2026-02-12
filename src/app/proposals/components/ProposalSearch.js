import styles from './ProposalSearch.module.scss'
import Input from '../../../components/ui/input/Input.js'
import Button from '../../../components/ui/button/Button.js'

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

                <Input
                    label='Search Proposals:'
                    name='proposal'
                    placeholder='Proposal title, company name, client'
                />
            </div>

            <div className={styles['search-section']}>
                <Input
                    label='Search Proposals:'
                    name='proposal'
                    placeholder='Proposal title, company name, client'
                />

                <Input
                    label='Search Proposals:'
                    name='proposal'
                    placeholder='Proposal title, company name, client'
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