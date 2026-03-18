'use client'

import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import CreateProposalHead from './components/CreateProposalHead'
import Input from '@/components/ui/input/Input'
import Checkbox from '@/components/ui/checkbox/Checkbox'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.js'
import PackageDealsSection from './components/PackageDealsSection.js'
import TimelineSection from './components/TimelineSection'

import {proposalReducer} from './reducers/proposalReducer'
import {createDeal, createTimeline} from './reducers/factories'
import {useState, useReducer, useEffect} from 'react'




export default function CreateProposal(){

    const [proposalType, setProposalType] = useState('SLA Package')
    const [clientType, setClientType] = useState('Taxable')

    const [proposalState, dispatch] = useReducer(proposalReducer, null);

    useEffect(() => {
    const initialProposal = {
        id: crypto.randomUUID(),
        clientId: '',
        clientType: '',
        proposalTitle: '',
        proposalType: '',
        executiveSummary: '',
        goalsAndObjectives: '',
        proposedSolution: '',
        executiveVideo: '',
        deals: [createDeal()],
        timelines: [createTimeline()]
    };

    dispatch({ type: 'INIT_PROPOSAL', payload: initialProposal });
    }, []);
      
    if (!proposalState) return <p></p>;

    return(

        
        <ChildLayout>
            <CreateProposalHead 
            setProposalType={setProposalType}
            serClientType={setClientType}
            />

            <Container>

                <div className={styles['create-proposal-body']}>
                    <h3>
                        Partnership Program Proposal
                    </h3>

                    <hr></hr>

                    <div className={styles['proposal-body-child']}>

                        <div className={styles['child-container']}>
                            <p>Proposal Solution Package:</p>
                            <Input
                            label='Select Package' 
                            />
                        </div>

                        <hr></hr>

                        <div className={styles['child-container']}>
                            <p>Team (leave blank if not applicable)</p>

                            <div className={styles['team-selection-container']}> 
                                <Checkbox label='hellafasevsrbo'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                            </div>
                            
                        </div>
                       
                    </div>

                    <hr></hr>

                    <p>Executive Summary</p>

                        <RichTextEditor/>

                    <hr></hr>

                    <p>Goals and Objectives</p>

                        <RichTextEditor/>
                        
                    <hr></hr>

                    <p>Proposed Solution</p>
                        <RichTextEditor/>

                    <hr></hr>

                    <p>Package Deals and Inclusions</p>

                        <PackageDealsSection
                            deals={proposalState.deals}
                            dispatch={dispatch}
                        />

                    <hr></hr>

                    <p>Package Description</p>

                    <hr></hr>

                    <p>Timeline</p>
                        
                        <TimelineSection
                            timelines={proposalState.timelines}
                            dispatch={dispatch}
                        />
                    <hr></hr>

                    <p>Pricing and Tax</p>
                    
                    <hr></hr>

                    <p>Payment Terms</p>

                </div>
            </Container>

        </ChildLayout>
    )
}