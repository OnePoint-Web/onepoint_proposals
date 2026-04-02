import Container from '@/components/layout/Container/Container'
import Input from '@/components/ui/input/Input'
import styles from './CreateProposalHead.module.scss'
export default function CreateProposalHead({dispatch, errors}){
    return(
        <Container fit='fullwidth'>
            <div className={styles['proposal-head']}>
                <h3>Proposal Title:</h3>
                
                <Input 
                    width='full'
                    placeholder='Enter Proposal title here..'
                    error={errors.proposalTitle}   // true/false for styling
                    errorMessage={errors.proposalTitle}
                    onChange={(e) => {
                        dispatch({
                            type: 'UPDATE_PROPOSAL_FIELD',
                            payload: {proposalTitle: e.target.value}
                        })
                    }}
                />

            </div>

            <hr></hr>

            <div className={styles['head-container']}>
                    <Input
                        label='Select Client:'
                        error={errors.clientId}
                        errorMessage={errors.clientId}
                        onChange={(e) => {
                            dispatch({
                                type: 'SET_FIELD',
                                field: 'clientId',
                                value: e.target.value,
                            })
                        }}
                    />

                     <Input
                        label='Client Type:'
                        type='select'
                        values={[
                            {id: 'Taxable', name: 'Taxable (+10% GST)'},
                            {id: 'Non-Taxable', name: 'Non-taxable'},
                        ]}
                        onChange={(e) => {
                           dispatch({
                                type: 'SET_CLIENT_TYPE',
                                payload: e.target.value
                            })
                        }}
                    />

                     <Input
                        label='Select Proposal Type:'
                        type='select'
                        values={[
                            {id: 'SLA Proposal', name: 'SLA Proposal'},
                            {id: 'Service Proposal', name: 'Service Proposal'},
                            {id: 'Product Proposal', name: 'Product Proposal'},
                        ]}
                        onChange={(e) => {
                            dispatch({
                                type: 'SET_PROPOSAL_TYPE',
                                payload: e.target.value,
                            });
                        }}

                        
                    />
            </div>
            
        </Container>
    )
}