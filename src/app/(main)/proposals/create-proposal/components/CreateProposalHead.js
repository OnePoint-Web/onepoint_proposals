import Container from '@/components/layout/Container/Container'
import Input from '@/components/ui/input/Input'
import styles from './CreateProposalHead.module.scss'
export default function CreateProposalHead({setProposalType, setClientType}){
    return(
        <Container fit='fullwidth'>
            <div className={styles['proposal-head']}>
                <h3>Proposal Title:</h3>
                
                <Input width='full'
                    placeholder='Enter Proposal title here..'
                />
            </div>

            <hr></hr>

            <div className={styles['head-container']}>
                    <Input
                        label='Select Client:'
                    />
                     <Input
                        label='Client Type:'
                        type='select'
                        onChange={(e) => setClientType(e.target.value)}
                        values={[
                            {id: 'Taxable', name: 'Taxable (+10% GST)'},
                            {id: 'Non-Taxable', name: 'Non-taxable'},
                        ]}
                    />
                     <Input
                        label='Select Proposal Type:'
                        type='select'
                        onChange={(e) => setProposalType(e.target.value)}
                        values={[
                            {id: 'SLA Package', name: 'SLA Package'},
                            {id: 'Service Proposal', name: 'Service Proposal'},
                            {id: 'Product Proposal', name: 'Product Proposal'},
                        ]}
                    />
            </div>
            
        </Container>
    )
}