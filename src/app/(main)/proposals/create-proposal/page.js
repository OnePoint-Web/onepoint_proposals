'use client'
import { date, z } from 'zod'
import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import CreateProposalHead from './components/CreateProposalHead'
import Button from '@/components/ui/button/Button.js'
import {Icons} from '@/components/icons/icons'
import CreateProposalBody from './CreateProposalBody'

const ProposalIcon = Icons.proposals;

import {proposalReducer} from './reducers/proposalReducer'
import {createInitialProposal} from './reducers/factories'
import { useRouter } from 'next/navigation'
import {useReducer, useEffect, useState} from 'react'
import { proposalSchema } from '@/schemas/proposal/createProposal.schema'

export default function CreateProposal(){
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(null) 
    const [submitMessage, setSubmitMessage] = useState('')
    const [proposalState, dispatch] = useReducer(proposalReducer, null);
    const [toggleModal, setToggleModal] = useState(false)


    useEffect(() => {
        dispatch({
        type: 'INIT_PROPOSAL',
        payload: createInitialProposal({
            proposalType: 'SLA Proposal',
            clientType: 'Taxable',
        }),
        });
    }, []);


    if (!proposalState) return <p></p>

   const mapZodErrors = (zodError) => {
        const errors = {}
        zodError.issues.forEach(err => {  // <-- use .issues, not .errors
            const path = err.path.length ? err.path.join('.') : '_root'
            errors[path] = err.message
        })
        return errors
    }

    const prepareProposalItemsForSubmit = (type, itemState) => {
         if(type === 'DEALS'){
        return itemState.map((deal, dealIndex) => ({
                ...deal,
                displayOrder: dealIndex + 1,
                packageDealEntries: deal.packageDealEntries.map((item, itemIndex) => ({
                    ...item,
                    displayOrder: itemIndex + 1
                    })) 
                }));
            } else if(type === 'ITEMS') {
                return itemState.map((item, itemIndex) => ({
                    ...item,
                    displayOrder: itemIndex + 1
                }));
            }
        }

    const cleanDeals = (dealsState) => {

         return dealsState
        .map(deal => ({
            ...deal,
            item: deal.item?.trim(),
            packageDealEntries: (deal.packageDealEntries || [])
                .map(item => ({
                    ...item,
                    itemEntry: item.itemEntry?.trim()
                }))
                .filter(item => item.itemEntry) // remove empty entries
        }))
        .filter(deal => 
            deal.item && deal.packageDealEntries.length > 0 // remove empty deals
        )
    }

    const cleanItems = (itemsState) => {
        return itemsState
            .map(item => ({
                ...item,
                item: item.serviceProductItem?.trim(),
                description: item.itemDescription?.trim() || '',
                itemPrice: Number(item.itemPrice) ?? 0,
                quantity: Number(item.quantity),
                itemDiscountValue: Number(item.itemDiscountValue) ?? 0
            })
            )
            .filter(item => item.item)
    }

    const cleanTimelines = (timelinesState) => {
        return timelinesState
            .map(timeline => ({
                ...timeline,
                timeFrame: timeline.timeFrame?.trim(),
                progress: Number(timeline.progress),
                assignedTo: timeline.assignedTo?.trim(),
                timelineScopeItems: (timeline.timelineScopeItems?.length ?? 0) > 0
                ? {
                    create: timeline.timelineScopeItems.map(s => ({
                    scope: s.scope
                    })).filter(scope => scope.scope)
                }
                : undefined
            })).filter(timeline => timeline.timeFrame)
    }

   const handleSubmit = async (e) => {
        e.preventDefault()

        setIsSubmitting(true)

        const cleanedState = {
        ...proposalState,
        timelines: cleanTimelines(proposalState.timelines || []),
        deals: cleanDeals(proposalState.deals || []),
        items: cleanItems(proposalState.items || [])
        }


         console.log(cleanedState)
        const result = proposalSchema.safeParse(cleanedState)

       
        if (!result.success) {
            const formattedErrors = mapZodErrors(result.error) // use issues now
            console.log('Zod Errors', formattedErrors)
            dispatch({ type: 'SET_VALIDATION_ERRORS', payload: formattedErrors })
            setIsSubmitting(false)
            setIsSuccess(false)
            setSubmitMessage('Please fill all necessary fields')
            return
        }

        dispatch({ type: 'CLEAR_VALIDATION_ERRORS' })

        let cleanProposalItemPayload;
        let proposalSubData;

            if(proposalState.proposalType === 'SLA Proposal'){
            
            const cleanedDeals = result.data.deals;

            cleanProposalItemPayload = prepareProposalItemsForSubmit('DEALS', cleanedDeals).map(deal => ({
                item: deal.item,
                itemType: deal.itemType,
                displayOrder: deal.displayOrder,
                packageDealEntries: deal.packageDealEntries.length > 0
                    ? {
                        create: deal.packageDealEntries.map(item => ({
                            itemEntry: item.itemEntry,
                            displayOrder: item.displayOrder
                        }))
                    }
                    : {}
            }))

            proposalSubData = {
                slaPackage: result.data.slaPackage,
                basePrice: result.data.basePrice,
                discountType: result.data.discountType,
                discountValue: result.data.discountValue,
                discountDescription: result.data.discountDescription,
                taxableAmount: result.data.taxableAmount,
                taxApplicable: result.data.taxApplicable,
                taxRate: result.data.taxRate,
                taxAmount: result.data.taxAmount,
                taxReason: result.data.taxReason,
                finalPrice: result.data.finalPrice,
                paymentTerms: result.data.paymentTerms,
                packageDealItem: {
                    create: cleanProposalItemPayload
                }
            }

            } else{
                const cleanedItems = result.data.items

                cleanProposalItemPayload = prepareProposalItemsForSubmit('ITEMS', cleanedItems).map(item => ({
                    serviceProductItem: item.item,
                    itemPrice: item.itemPrice,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                    itemDiscountType: item.itemDiscountType,
                    itemDiscountValue: item.itemDiscountValue,
                    itemDiscountDescription: item.itemDiscountDescription,
                    description: item.description,
                    displayOrder: item.displayOrder, 

                }))

                proposalSubData = {
                    type: result.data.proposalType,
                    isMultipleChoice: result.data.isMultipleChoice,
                    subTotal: result.data.subtotal,
                    discountType: result.data.discountType,
                    discountValue: result.data.discountValue,
                    discountDescription: result.data.discountDescription,
                    taxableAmount: result.data.taxableAmount,
                    taxApplicable: result.data.taxApplicable,
                    taxRate: result.data.taxRate,
                    taxAmount: result.data.taxAmount,
                    taxReason: result.data.taxReason,
                    finalPrice: result.data.finalPrice,
                    paymentTerms: result.data.paymentTerms,
                    offerEntries: {
                        create: cleanProposalItemPayload
                    }
                }
            }

            const baseData = {
                slaPackage: result.data.slaPackage,
                clientId: result.data.clientId,
                clientType: result.data.clientType,
                proposalTitle: result.data.proposalTitle,
                proposalType: result.data.proposalType,
                executiveSummary: result.data.executiveSummary,
                goalsAndObjectives: result.data.goalsAndObjectives,
                execVideoUrl: result.data.execVideoUrl,
                proposedSolution: result.data.proposedSolution,
                proposalDescription: result.data.proposalDescription,
                isMultipleChoice: result.data.isMultipleChoice,
            }
            const payload = proposalState.proposalType === 'SLA Proposal' ? 
            {
                ...baseData,
                timelines: result.data.timelines,
                slaOffers: proposalSubData,
                selectedMembers: result.data.selectedMembers
                
                
            } :
            {
                ...baseData,
                timelines: result.data.timelines,
                serviceProductOffers: proposalSubData,
                selectedMembers: result.data.selectedMembers
                
            }

          try{
            const res = await fetch("/api/proposals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
            })

            const result = await res.json()
            console.log(result)
            
            if (!res.ok) {
                if (result.field) {
                setError(result.field, {
                    type: "server",
                    message: result.message,
                })
                setIsSubmitting(false)
                setIsSuccess(false)
                setSubmitMessage('Server Error')
                return
                }
                    console.error(result)
                    setIsSubmitting(false)
                    setIsSuccess(false)
                    setSubmitMessage('Error creating proposal')
                    return
            }
            
            console.log("Success:", result)
            setIsSubmitting(false)
            setIsSuccess(true)
            setToggleModal(true)

            setTimeout(() => {
            router.push('/proposals')
            }, 2000)

        }catch(err){
            console.error(err)
            setIsSubmitting(false)
            setIsSuccess(false)
            setSubmitMessage('Error creating proposal')
        }

    }
    
     return(
        
        <ChildLayout>
            
            <CreateProposalHead 
                dispatch={dispatch}
                errors={proposalState.validationErrors}
                proposalState={proposalState}
            />

            <Container>

                <CreateProposalBody proposalState={proposalState} dispatch={dispatch}  errors={proposalState.validationErrors}/>
        
            </Container>

            <Container fit='medium'>
                 { isSuccess && <p className={styles.success}>Proposal created successfully</p>}
                 { isSuccess === false && <p className={styles.error}>{submitMessage}</p>}
                <div className={styles['proposal-submit-container']}>
                    <Button
                        label={isSubmitting ? 'Creating proposal...' : 'Publish'}
                        color='red' 
                        size ='md'
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                    />

                    <Button
                        label='Save Draft'
                        color='dark'
                        size ='md'
                    />
                </div>

            </Container>

          {toggleModal && (
                <div 
                  className={`${styles['success-modal-bg']}`} 
                >  

                  <div className={styles['success-modal-container']} onClick={(e) => e.stopPropagation()}>
                    <ProposalIcon className={styles.icon}/>
                    <p className={styles.head}>Proposal Successfully Created!</p>
                    <p className={styles.message}>Redirecting to proposals page...</p>

                  </div>              
              
                </div>  
              )}


        </ChildLayout>
    )
}


