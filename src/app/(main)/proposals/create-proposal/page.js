'use client'

import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import CreateProposalHead from './components/CreateProposalHead'

import CreateProposalBody from './CreateProposalBody'

import {proposalReducer} from './reducers/proposalReducer'
import {createInitialProposal} from './reducers/factories'
import {useReducer, useEffect} from 'react'

export default function CreateProposal(){

    const [proposalState, dispatch] = useReducer(proposalReducer, null);

    useEffect(() => {
        dispatch({
        type: 'INIT_PROPOSAL',
        payload: createInitialProposal({
            proposalType: 'SLA Proposal',
            clientType: 'Taxable',
        }),
        });
    }, []);


    if (!proposalState) return <p></p>;

     return(
        
        
        <ChildLayout>
            
            <CreateProposalHead 
            dispatch={dispatch}
            />

            <Container>

                <CreateProposalBody proposalState={proposalState} dispatch={dispatch}/>
        
            </Container>

        </ChildLayout>
    )
}


