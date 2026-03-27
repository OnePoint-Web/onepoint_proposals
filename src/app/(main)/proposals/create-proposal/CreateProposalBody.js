'use client'
import styles from './page.module.scss'
import Input from '@/components/ui/input/Input'
import Checkbox from '@/components/ui/checkbox/Checkbox'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.js'
import PackageDealsSection from './components/PackageDealsSection.js'
import ProposalItemSection from './components/ProposalItemSection'
import TimelineSection from './components/TimelineSection'
import PriceSection from './components/PriceSection'


export default function CreateProposalBody({dispatch, proposalState}){
    
    return(

        <div className={styles['create-proposal-body']}>

        {proposalState.proposalType === 'SLA Proposal' && (
            <h3>
                Service Level Agreement Proposal
            </h3>
        )}

        {proposalState.proposalType === 'Service Proposal' && (
            <h3>
                Service Proposal
            </h3>
        )}

        {proposalState.proposalType === 'Product Proposal' && (
            <h3>
                Product Proposal
            </h3>
        )}



        <hr></hr>

        <div className={styles['proposal-body-child']}>


        {proposalState.proposalType === 'SLA Proposal' && (
            <>
            <div className={styles['child-container']}>
                <p>Proposal Solution Package:</p>
                <Input
                label='Select Package'
                onChange={(e) => {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'packageType',
                    value: e.target.value
                })
            }} 
                />
            </div>

            <hr></hr>
            </>
        )}
            

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

            <RichTextEditor
                onChange={(html) => {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'executiveSummary',
                    value: html
                })
            }}
            />

            <div className={styles['proposal-body-child']}>

                    <Input
                        label='Executive video URL:'
                        width='medium'
                        onChange={(e) =>
                            dispatch({
                                type: 'SET_FIELD',
                                field: 'execVideoUrl',
                                value: e.target.value
                            })
                        }
                    />
                
                    <div className={styles['video-container']}>
                        
                    </div>
                
            </div>
            
        <hr></hr>

        <p>Goals and Objectives</p>

            <RichTextEditor
            onChange={(e) => {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'gaolsAndObjectives',
                    value: e.target.value
                })
            }}
            />
            
        <hr></hr>

        <p>Proposed Solution</p>
            <RichTextEditor
            onChange={(e) => {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'proposedSolution',
                    value: e.target.value
                })
            }}
            />

        <hr></hr>

        
        {proposalState.proposalType === 'SLA Proposal' ? (
            <>
            <p>Package Deals and Inclusions</p>

            <PackageDealsSection
                deals={proposalState.deals}
                dispatch={dispatch}
            />

            <hr></hr>
            </>
        ) : (
            <>
            <p>Products</p>

            <ProposalItemSection
                items={proposalState.items}
                dispatch={dispatch}
                proposalType={proposalState.proposalType}
            />

            <hr></hr>
            </>
        )}

        {proposalState.proposalType === 'SLA Proposal' ? (
            <p>Package Description</p>
        ) :
        
        (
            <p>Proposal Description</p>
        )}

        <Input
            width='full'
            type='textarea'
            onChange={(e) => {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'proposalDescription',
                    value: e.target.value
                })
            }}
        />
        <hr></hr>
                

        <p>Timeline</p>
            
            <TimelineSection
                timelines={proposalState.timelines}
                dispatch={dispatch}
            />

        <hr></hr>

       
        <PriceSection
            proposalState={proposalState}
            dispatch={dispatch}
            propsalType=''
        />

        <hr></hr>

        <p>Payment Terms</p>

        <Input
            width='full'
            type='textarea'
            onChange={(e) => {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'paymentTerms',
                    value: e.target.value
                })
            }}
        />

    </div>
    )
}