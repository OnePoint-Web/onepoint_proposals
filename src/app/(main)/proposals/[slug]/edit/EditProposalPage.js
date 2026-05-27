'use client'
import styles from './page.module.scss'
import Container from "@/components/layout/Container/Container"
import Input from '@/components/ui/input/Input.js'
import Button from '@/components/ui/button/Button.js'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.js'
import VideoPlayer from '@/components/ui/video-player/VideoPlayer.js'
import EditDealsSection from './components/EditDealsSection'
import EditItemsSecion from './components/EditItemsSection'
import EditTimelineSection from './components/EditTimelinesSection'
import EditTeamSection from './components/EditTeamSection'
import BudgetSection from './components/BudgetSection'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import {useRouter} from 'next/navigation'
import { Icons } from '@/components/icons/icons'


import {editProposalReducer} from './reducers/editProposalReducer'
import {useState, useEffect, useReducer} from 'react'

const ProposalIcon = Icons.proposals
export default function EditProposalPage({proposalData}){

    const [packages, setPackages] = useState([])
    const [proposalState, dispatch] = useReducer(editProposalReducer, null)
    const [clientDetails, setClientDetails] = useState({})
    const [toggleModal, setToggleModal] = useState(false)
    const [serviceProductItems, setServiceProductItems] = useState([])
    const router = useRouter()

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
            proposalId: proposalData.proposalId,
            proposalTitle: proposalData.proposalTitle,
            executiveSummary: proposalData.executiveSummary,
            goalsAndObjectives: proposalData.goalsAndObjectives,
            execVideoUrl: proposalData.execVideoUrl,
            proposedSolution: proposalData.proposedSolution,
            proposalDescription: proposalData.proposalDescription,
            proposalType: proposalData.proposalType,
            statusId: proposalData.statusId,

            selectedMembers: proposalData.selectedMembers.map( m => ({
                selectedMemberId: m.selectedMemberId,
                memberId: m.memberId,
                teamMember: {
                    description: m.teamMember.description,
                    memberImage: m.teamMember.memberImage,
                    memberName: m.teamMember.memberName,
                    memberRole: m.teamMember.memberRole
                },
                // _status: 'existing'
            })),

            timelines: proposalData.timelines.map(t => ({
                timelineId: t.timelineId,
                timeFrame: t.timeFrame,
                progress: t.progress,
                timelineScopeItems: t.timelineScopeItems.map(s => ({
                    scopeItemId: s.scopeItemId,
                    scope: s.scope,
                    order: s.order,
                    // _status: 'existing'
                })),
                // _status: 'existing'
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
                        // _status: 'existing'
                    })),
                    // _status: 'existing'

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
                    itemDescription: e.description,
                    itemImage: e.itemImage,
                    displayOrder: e.displayOrder,
                    _status: 'existing'
                })),
            }
        }

        const clientState = {
            clientName: proposalData.clientProfile.user.firstName + ' ' + proposalData.clientProfile.user.lastName,
            email: proposalData.clientProfile.user.userEmail,
            companyName: proposalData.clientProfile.companyName,
            companyAddress: proposalData.clientProfile.companyAddress,
            companyEmail: proposalData.clientProfile.companyEmail,
            companyWebsite: proposalData.clientProfile.website,
        }

        setClientDetails(clientState)

         dispatch({ type: 'INITIALIZE', payload: initialState });
    }, [proposalData])


    useEffect(() => {
        console.log('PROPOSALSTATE', proposalData)
    }, [proposalState])

    useEffect(() => {
        if (proposalData.proposalType === 'Product Proposal') {
            fetch('/api/products?limit=1000')
            .then(res => res.json())
            .then(results => {
                const productOptions = (results.data || []).map(item => ({
                    id: item.productId,
                    name: item.product,
                    price: item.price,
                    description: item.description,
                    image: item.productImage
                }))
                setServiceProductItems(productOptions)
            })
            return
        }

        if (proposalData.proposalType === 'Service Proposal') {
            fetch('/api/services?limit=1000')
            .then(res => res.json())
            .then(results => {
                const serviceOptions = (results.data || []).map(item => ({
                    id: item.serviceId,
                    name: item.service,
                    price: item.price,
                    description: item.description,
                    image: ''
                }))
                setServiceProductItems(serviceOptions)
            })
            return
        }

    }, [proposalData.proposalType])


    const buildProposalPayload = (proposalState) => {


        const payload = {
            ...proposalState,
            selectedMembers: (proposalState.selectedMembers ?? []).map(m => (
                {memberId: m.memberId}
            )),
            timelines: (proposalState.timelines ?? []).map(t => ({
                timeFrame: t.timeFrame,
                progress: t.progress,
                timelineScopeItems: { create: (t.timelineScopeItems ?? []).map(s => ({
                    scope: s.scope,
                }))},
            })),
            ...(proposalState.proposalType === 'SLA Proposal' ? {
                slaOffers: {
                    slaPackage: proposalState.offer.slaPackage,
                    basePrice: proposalState.offer.basePrice,
                    discountType: proposalState.offer.discountType,
                    discountValue: proposalState.offer.discountValue,
                    discountDescription: proposalState.offer.discountDescription,
                    taxableAmount: proposalState.offer.taxableAmount,
                    taxApplicable: proposalState.offer.taxApplicable,
                    taxRate: proposalState.offer.taxRate,
                    taxAmount: proposalState.offer.taxAmount,
                    taxReason: proposalState.offer.taxReason,
                    finalPrice: proposalState.offer.finalPrice,
                    paymentTerms: proposalState.offer.paymentTerms,
                    packageDealItem: (proposalState.offer.packageDealItem ?? []).map(d => ({
                        item: d.item,
                        itemType: d.itemType,
                        isCustom: false,
                        displayOrder: d.displayOrder, 
                        packageDealEntries: (d.packageDealEntries ?? []).map(p => ({
                            itemEntry: p.itemEntry,
                        }))
                    }))
                }
            } : {}),
            ...(proposalState.proposalType !== 'SLA Proposal' ? {
                serviceProductOffers:{
                    type: proposalState.offer.type,
                    isMultipleChoice: proposalState.offer.isMultipleChoice,
                    subTotal: proposalState.offer.subTotal,
                    discountType: proposalState.offer.discountType,
                    discountValue: proposalState.offer.discountValue,
                    discountDescription: proposalState.offer.discountDescription,
                    taxableAmount: proposalState.offer.taxableAmount,
                    taxApplicable: proposalState.offer.taxApplicable,
                    taxRate: proposalState.offer.taxRate,
                    taxAmount: proposalState.offer.taxAmount,
                    taxReason: proposalState.offer.taxReason,
                    finalPrice: proposalState.offer.finalPrice,
                    paymentTerms: proposalState.offer.paymentTerms,
                    offerEntries: {
                        create: proposalState.offer.offerEntries.map(e => ({
                            serviceProductItem: e.serviceProductItem,
                            itemPrice: e.itemPrice,
                            quantity: e.quantity,
                            totalPrice: e.totalPrice,
                            itemDiscountType: e.itemDiscountType,
                            itemDiscountValue: e.itemDiscountValue,
                            itemDiscountDescription: e.itemDiscountDescription,
                            description: e.description,
                            itemImage: e.itemImage || null,
                            displayOrder: e.displayOrder,
                        }))
                    },
                }
            } : {})
        }

        return payload
    }

    const handleUpdateSubmit = async (e, status) => {
            e.preventDefault()

            console.log('Clicking submit', proposalState)

            const payload = {
                ...buildProposalPayload(proposalState),
                statusId: status    
            }

            try{
                const res = await fetch(`/api/proposals/[${proposalData.slug}]/edit`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                })

                const result = await res.json()
                console.log(result.slug)

                setToggleModal(true)

                setTimeout(() => {
                    router.push(`/proposals/${result.slug}`)
                }, 1000)
                

            }catch(err){
                console.log("Error submitting",err)
            }
    }


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
                        placeholder='Enter new proposal title here...'
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PROPOSAL_TITLE',
                                payload: e.target.value
                            })}
                        }
                    />

                   
                </div>

                 <hr></hr>

               
                <div className={styles['title-section']}>

                    <p className={styles['title-head']}> Client Details:</p>
                    <div className={styles['client-details']}>
                        <div className={styles['details-container']}>
                            <p>{proposalData.proposalType}</p>
                            <p>{clientDetails.clientName}</p>
                            <p>{clientDetails.email}</p>
                        </div>

                            <hr></hr>
                        
                        <div className={styles['details-container']}>
                            <p>Company Email: {clientDetails.companyEmail}</p>
                            <p>{clientDetails.companyName}</p>
                            <p>Website: {clientDetails.companyWebsite}</p>
                            <p>Address: {clientDetails.companyAddress}</p>
                        </div>
                        
                    </div>

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
                                payload: {goalsAndObjectives: html},
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
                                payload: {proposedSolution: html},
                            })
                        }}
                    />

                    <hr></hr>
                    <p>Description</p>
                    <Input
                        value={proposalState.proposalDescription}
                        onChange={(e) => {
                            console.log('type')
                            dispatch({
                                type: 'UPDATE_PROPOSAL_FIELD',
                                payload: {proposalDescription: e.target.value }
                            })
                        }}
                        label='Description:'
                        width='full'
                        type='textarea'
                        hideLabel='true'
                    />

                     <hr></hr>
                    <p>Proposal Inclusions</p>
                        {proposalData.proposalType === 'SLA Proposal' ? (
                            <EditDealsSection deals={proposalState.offer.packageDealItem} dispatch={dispatch}/>
                        )
                        : (
                            <EditItemsSecion
                                items={proposalState.offer.offerEntries}
                                dispatch={dispatch}
                                proposalType={proposalState.proposalType}
                                serviceProductItems={serviceProductItems}
                            />
                        )}
                        
                    
                    <hr></hr>

                    <p>Timeline</p>


                        <EditTimelineSection
                            timelines={proposalState.timelines}
                            dispatch={dispatch}
                        />
                     
                    
                     <hr></hr>

                    <p>Team</p>
                        
                        <EditTeamSection
                            dispatch={dispatch}
                            membersState={proposalState.selectedMembers}
                        />

                    <hr></hr>

                    <p>Budget</p>

                        <BudgetSection
                            proposalState={proposalState}
                            dispatch={dispatch}
                        />

                        <hr></hr>

                    <p>Payment Terms</p>
                    <Input
                        value={proposalState.offer.paymentTerms}
                        onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_PRICING_FIELD',
                                payload: {paymentTerms: e.target.value }
                            })
                        }}
                        label='Payment Terms:'
                        hideLabel='true'
                        width='full'
                        type='textarea'
                    />

                </div>

            </Container>

            <Container fit={'fullwidth'}>
                <Button
                    label='Save Changes'
                    onClick={(e)=> handleUpdateSubmit(e, proposalData.statusId)}
                    color='dark'
                />

                {proposalData.statusId === 0 &&(
                    <Button
                        label='Publish for Sending'
                        onClick={(e)=> handleUpdateSubmit(e, 1)}
                        color='red'
                    />
                )}

                {proposalData.statusId === 1 &&(
                    <Button
                        label='Save as Draft'
                        onClick={(e)=> handleUpdateSubmit(e, 0)}
                        color='red'
                    />
                )}

                {toggleModal && (
                    <SuccessModal
                        message='Changes saved'
                        icon={ProposalIcon}
                        actionMessage={'Redirecting to proposal...'}
                    />
                )}
            </Container>

            
        </>
    )
}
