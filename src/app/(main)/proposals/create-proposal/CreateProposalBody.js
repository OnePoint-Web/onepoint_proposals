    'use client'
    import styles from './page.module.scss'
    import Input from '@/components/ui/input/Input'
    import Checkbox from '@/components/ui/checkbox/Checkbox'
    import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.js'
    import PackageDealsSection from './components/PackageDealsSection.js'
    import ProposalItemSection from './components/ProposalItemSection'
    import TimelineSection from './components/TimelineSection'
    import PriceSection from './components/PriceSection'
    import VideoPlayer from '@/components/ui/video-player/VideoPlayer'

    import {useEffect, useState} from 'react'

    export default function CreateProposalBody({dispatch, proposalState, errors}){

        const [members, setMembers] = useState([])
        const [packages, setPackages] = useState([])
        const [serviceProductItems, setServiceProductItems] = useState([])
        
        useEffect(() => {
            fetch('/api/members')
            .then(res => res.json())
            .then(results => {
                const membersOptions = results.data.map(member => ({
                    id: member.memberId,
                    name: member.memberName,
                    role: member.memberRole,
                    memberImage: member.memberImage,
                    description: member.description
                }))
                setMembers(membersOptions)
            })
        }, [])

        useEffect(() => {
            fetch('/api/packages')
            .then(res => res.json())
            .then(results => {
                const  packagesOptions = results.data.map(item => ({
                    id: item.packageId,
                    title: item.package,
                    description: item.description,
                    solution: item.proposedSolution,
                    price: item.basePrice,
                    deals: item.dealItems
                }))
                setPackages(packagesOptions)
            })

            
        }, [])

        useEffect(() => {
            if (proposalState.proposalType === 'Product Proposal') {
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

            if (proposalState.proposalType === 'Service Proposal') {
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

        }, [proposalState.proposalType])

        const selectPackages = packages.map(item => (
            {
            id: item.title,
            name: item.title
            }
        ))

        const packageOptions = [{id: "Custom Package", name: 'Custom Package'}, ...selectPackages]
        

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
                    <p>Proposal Package:</p>
                    <Input
                        label='Select Package'
                        type='select'
                        value={proposalState.slaPackage}
                        values={packageOptions}
                        error={errors['proposalPackage']}
                        errorMessage={errors.proposalPackage}
                        onChange={(e) => {
                            const selectedId = e.target.value
                            if (selectedId === "Custom Package") {
                                dispatch({
                                type: 'SELECT_PACKAGE',
                                payload: null
                                })
                                return
                            }

                            const selectedPackage = packages.find(p => p.title === selectedId)
                            dispatch({
                                type: 'SELECT_PACKAGE',
                                payload: selectedPackage
                            })

                            console.log('PACKAGE', packages)
                        }} 
                    />
                </div>

                <hr></hr>
                </>
            )}
                

                <div className={styles['child-container']}>
                    <p>Team (leave blank if not applicable)</p>

                    <div className={styles['team-selection-container']}> 
                        { members.length !== 0 ?
                            members.map(member => (
                                <Checkbox key={member.id} 
                                label={member.name}
                                checked={proposalState.selectedMembers.some(m => m.memberId === member.id)}
                                onChange={() =>{
                                    dispatch({
                                    type: 'TOGGLE_TEAM_MEMBER',
                                    payload: member.id
                                    })}
                                }
                                />
                            ))
                            : <p>No available team members to choose from</p>

                        }
            
                    </div>
                    
                </div>
                
            </div>

            <hr></hr>

            <p>Executive Summary</p>

                <RichTextEditor
                    onChange={(html) => {
                    dispatch({
                        type: 'UPDATE_PROPOSAL_FIELD',
                        payload: {executiveSummary: html},
                    
                    })
                }}
                />

                <div className={styles['proposal-body-child']}>

                        <Input
                            label='Executive video URL:'
                            width='medium'
                            placeholder='Enter video url here..'
                            error={errors.execVideoUrl}
                            errorMessage={errors.execVideoUrl}
                            onChange={(e) =>
                                dispatch({
                                    type: 'UPDATE_PROPOSAL_FIELD',
                                    payload: {execVideoUrl:  e.target.value},
                                })
                            }
                        />
                    
                        <VideoPlayer
                            url={proposalState.execVideoUrl}
                        />
                    
                </div>
                
            <hr></hr>

            <p>Goals and Objectives</p>

                <RichTextEditor
                onChange={(html) => {
                    dispatch({
                        type: 'UPDATE_PROPOSAL_FIELD',
                        payload: {goalsAndObjectives:  html},
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
                        payload: {proposedSolution:  html},
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
                    errors={errors}
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
                    errors={errors}
                    serviceProductItems={serviceProductItems}
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
                value={proposalState.proposalDescription}
                error={errors.proposalDescription}
                errorMessage={errors.proposalDescription}
                onChange={(e) => {
                    dispatch({
                        type: 'UPDATE_PROPOSAL_FIELD',
                        payload: {proposalDescription:  e.target.value},
                    })
                }}
            />
            <hr></hr>
                    

            <p>Timeline</p>
                
                <TimelineSection
                    timelines={proposalState.timelines}
                    dispatch={dispatch}
                    errors={errors}
                />

            <hr></hr>

        
            <PriceSection
                proposalState={proposalState}
                dispatch={dispatch}
                errors={errors}
            />

            <hr></hr>

            <p>Payment Terms</p>

            <Input
                width='full'
                type='textarea'
                error={errors.paymentTerms}
                errorMessage={errors.paymentTerms}
                onChange={(e) => {
                    dispatch({
                        type: 'UPDATE_PROPOSAL_FIELD',
                        payload: {paymentTerms: e.target.value}
                    })
                }}
            />

        </div>
        )
    }
