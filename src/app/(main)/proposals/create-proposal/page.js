'use client'
import { date, z } from 'zod'
import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import CreateProposalHead from './components/CreateProposalHead'
import Button from '@/components/ui/button/Button.js'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import {Icons} from '@/components/icons/icons'
import CreateProposalBody from './CreateProposalBody'
import {buildProposalPayload, cleanDeals, cleanItems, cleanTimelines} from '@/utils/proposals/Transformers.js'

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

   const handleSubmit = async (e, status) => {
        e.preventDefault()

        setIsSubmitting(true)

        const cleanedState = {
        ...proposalState,
        timelines: cleanTimelines(proposalState.timelines || []),
        deals: cleanDeals(proposalState.deals || []),
        items: cleanItems(proposalState.items || [])
        }

        const parsedResult = proposalSchema.safeParse(cleanedState)
        console.log(parsedResult)
       
        if (!parsedResult.success) {
            const formattedErrors = mapZodErrors(parsedResult.error) // use issues now
            console.log('Zod Errors', formattedErrors)
            dispatch({ type: 'SET_VALIDATION_ERRORS', payload: formattedErrors })
            setIsSubmitting(false)
            setIsSuccess(false)
            setSubmitMessage('Please fill all necessary fields')
            return
        }

        dispatch({ type: 'CLEAR_VALIDATION_ERRORS' })

        const payload = {
            ...buildProposalPayload(proposalState, parsedResult),
            proposalStatus: status    
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
                        onClick={(e) => handleSubmit(e, 1)}
                    />

                    <Button
                        label='Save Draft'
                        color='dark'
                        size ='md'
                        onClick={(e) => handleSubmit(e, 0)}
                    />
                </div>

            </Container>

          {toggleModal && (

                <SuccessModal
                    onClick={(e) => e.stopPropagation()}
                    icon={ProposalIcon}
                    message='Proposal Successfully Created!'
                    actionMessage='Redirecting to proposals page...'
                />
              )}


        </ChildLayout>
    )
}


