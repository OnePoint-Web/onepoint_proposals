'use client'
import styles from './page.module.scss'
import ChildLayout from "@/components/layout/ChildLayout/ChildLayout"
import Container from "@/components/layout/Container/Container"
import Input from '@/components/ui/input/Input.js'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.js'
import VideoPlayer from '@/components/ui/video-player/VideoPlayer.js'
import EditDealsSection from './components/EditDealsSection'

import {editProposalReducer} from './reducers/editProposalReducer'
import {useState, useEffect, useReducer} from 'react'

export default function EditProposalPage({proposalData}){

    const [packages, setPackages] = useState([])
    const [proposalState, dispatch] = useReducer(editProposalReducer, null)

    useEffect(() => {
        fetch('/api/packages')
        .then(res => res.json())
        .then(data => {
            const  packagesOptions = data.map(item => ({
                packageId: item.packageId,
                slaPackage: item.package,
                proposalDescription: item.description,
                proposedSolution: item.proposedSolution,
                basePrice: item.basePrice,
                dealItems: item.dealItems
            }))
            setPackages(packagesOptions)
        })
    }, [])

    useEffect(() => {

        const isSla = proposalData.proposalType === 'SLA Proposal'
        const sla = proposalData.slaOffers?.[0]
        const serviceProduct = proposalData.serviceProductOffers?.[0]

        const initialState = {
            proposalTitle: proposalData.proposalTitle,
            executiveSummary: proposalData.executiveSummary,
            goalsAndObjectives: proposalData.goalsAndObjectives,
            execVideoUrl: proposalData.execVideoUrl,
            proposedSolution: proposalData.proposedSolution,
            proposalDescription: proposalData.proposalDescription,
            proposalType: proposalData.proposalType,

            selectedMembers: proposalData.selectedMembers.map( m => ({
                selectedMemberId: m.selectedMemberId,
                memberId: m.memberId,
                teamMember: {
                    description: m.teamMember.description,
                    memberImage: m.teamMember.memberImage,
                    memberName: m.teamMember.memberName,
                    memberRole: m.teamMember.memberRole
                },
                _status: 'existing'
            })),

            timelines: proposalData.timelines.map(t => ({
                timelineId: t.timelineId,
                timeFrame: t.timeFrame,
                progress: t.progress,
                timelineScopeItems: t.timelineScopeItems.map(s => ({
                    scopeItemId: s.scopeItemId,
                    scope: s.scope,
                    _status: 'existing'
                })),
                _status: 'existing'
            })),

            offer: isSla && sla ? {
                proposalId: sla.proposalId,
                slaOfferId: sla.slaOfferId,
                slaPackage: sla.slaPackage,
                basePrice: sla.basePrice,
                discountType: sla.discountType,
                discountValue: sla.discountValue,
                discountDescription: sla.discountDescription,
                taxableAmount: sla.taxableAmount,
                taxApplicable: sla.taxApplicable,
                taxRate: sla.taxRate,
                taxAmount: sla.taxAmount,
                taxReason: sla.taxReason,
                finalPrice: sla.finalPrice,
                paymentTerms: sla.paymentTerms,

                packageDealItem: sla.packageDealItem.map(i => ({
                    packageDealItemId: i.packageDealItemId,
                    item: i.item,
                    itemType: i.itemType,
                    displayOrder: i.displayOrder,
                    packageDealEntries: i.packageDealEntries.map(e => ({
                        itemEntryId: e.itemEntryId,
                        itemEntry: e.itemEntry,
                        displayOrder: e.displayOrder,
                        _status: 'existing'
                    })),
                    _status: 'existing'

                }))
            } : {
                proposalId: serviceProduct.proposalId,
                serviceProductOfferId: serviceProduct.serviceProductOfferId,
                type: serviceProduct.type,
                isMultipleChoice: serviceProduct.isMultipleChoice,
                subTotal: serviceProduct.subTotal,
                discountType: serviceProduct.discountType,
                discountValue: serviceProduct.discountValue,
                discountDescription: serviceProduct.discountDescription,
                taxableAmount: serviceProduct.taxableAmount,
                taxApplicable: serviceProduct.taxApplicable,
                taxRate: serviceProduct.taxRate,
                taxAmount: serviceProduct.taxAmount,
                taxReason: serviceProduct.taxReason,
                finalPrice: serviceProduct.finalPrice,
                paymentTerms: serviceProduct.paymentTerms,

                offerEntries: serviceProduct.offerEntries.map(e => ({
                    offerEntryId: e.offerEntryId,
                    serviceProductItem: e.serviceProductItem,
                    itemPrice: e.itemPrice,
                    quantity: e.quantity,
                    totalPrice: e.totalPrice,
                    itemDiscountType: e.itemDiscountType,
                    itemDiscountValue: e.itemDiscountValue,
                    itemDiscountDescription: e.itemDiscountDescription,
                    description: e.description,
                    displayOrder: e.displayOrder,
                    _status: 'existing'
                })),
            }
        }

         dispatch({ type: 'INITIALIZE', payload: initialState });
    }, [proposalData])


    useEffect(() => {
        console.log('PROPOSALSTATE', proposalState)
    }, [proposalState])


    if(!proposalState){return <p>Fetching Proposal Data</p>}

    return(
       <>
            <Container fit='fullwidth'>

                <div className={styles['title-container']}>
                    <p>You are now editing: </p>
                    <h1>{proposalData.proposalTitle}</h1>

                    <hr></hr>

                    <Input 
                        label='Edit proposal title:'
                        width='full'
                    />
                </div>

            </Container>

            <Container>
                <div className={styles['edit-proposal-body']}>

                    
                   <p>Executive Summary</p>
                    <RichTextEditor
                        value={proposalState.executiveSummary}
                        onChange={(html) => {
                        dispatch({
                                type: 'UPDATE_PROPOSAL_FIELD',
                                payload: {executiveSummary: html},
                            
                            })
                        }}
                    />

                    <p>Executive Summary Video</p>


                    <div className={styles['video-container-main']}>
                        <div className={styles['video-container']}>

                            <VideoPlayer
                                size='full'
                            />

                        </div>

                        <div className={styles['video-link-container']}>
                            <Input
                                label='Video URL:'
                                width='full'
                            />
                        </div>

                        
                    </div>
                    

                    <hr></hr>

                    <p>Goals and Objectives</p>
                    <RichTextEditor
                        value={proposalState.goalsAndObjectives}
                        onChange={(html) => {
                        dispatch({
                                type: 'UPDATE_PROPOSAL_FIELD',
                                payload: {executiveSummary: html},
                            
                            })
                        }}
                    />

                    <hr></hr>

                    <p>Proposed Solution</p>
                    <RichTextEditor
                    
                        value={proposalState.proposedSolution}
                        onChange={(html) => {
                        dispatch({
                                type: 'UPDATE_PROPOSAL_FIELD',
                                payload: {executiveSummary: html},
                            
                            })
                        }}
                    />

                    <hr></hr>
                    <p>Description</p>
                    <Input
                    value={proposalState.proposalDescription}
                    onChange={() => {}}
                    label='Description:'
                    width='full'
                    type='textarea'
                    hideLabel='true'
                    />

                     <p>Payment Terms</p>
                    <Input
                    value={proposalState.offer.paymentTerms}
                    onChange={() => {}}
                    label='Payment Terms:'
                    hideLabel='true'
                    width='full'
                    type='textarea'
                    />

                     <hr></hr>
                    <p>Proposal Inclusions</p>
                        <EditDealsSection deals={proposalState.offer.packageDealItem} dispatch={dispatch}/>
                    <hr></hr>

                    <p>Timeline</p>

                     
                    
                     <hr></hr>

                    

                    <p>Team</p>
                    

                    <hr></hr>

                    <p>Budget</p>
                </div>

            </Container>
        </>
    )
}