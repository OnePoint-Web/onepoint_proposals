import Container from '@/components/layout/Container/Container'
import ComboBox from '@/components/ui/combobox/ComboBox'
import Input from '@/components/ui/input/Input'
import styles from './CreateProposalHead.module.scss'
import {useState, useEffect} from 'react'
export default function CreateProposalHead({proposalState, dispatch, errors}){
    const [options, setOptions] = useState([])

    useEffect(() => {
            fetch("/api/clients")
            .then(res => res.json())
            .then(data => {
                const clientOptions = data.map(user => ({
                    id: user.userId,
                    name: user.firstName + ' ' + user.lastName,
                }))
            setOptions(clientOptions)
            })
            
        }, [])

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
                    <ComboBox
                        placeholder='Select Client..'
                        label='Select Client:'
                        error={errors.clientId}
                        options={options}
                        value={proposalState.clientId}
                        errorMessage={errors.clientId}
                        onSelect={(value) => {
                            dispatch({
                                type: 'UPDATE_PROPOSAL_FIELD',
                                payload: {clientId: value},
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