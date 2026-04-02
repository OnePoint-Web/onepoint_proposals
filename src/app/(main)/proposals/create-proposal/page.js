'use client'
import { z } from 'zod'
import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import CreateProposalHead from './components/CreateProposalHead'
import Button from '@/components/ui/button/Button.js'

import CreateProposalBody from './CreateProposalBody'

import {proposalReducer} from './reducers/proposalReducer'
import {createInitialProposal} from './reducers/factories'
import {useReducer, useEffect} from 'react'

import { proposalSchema } from '@/schemas/proposal/createProposal.schema'

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

    useEffect(() => {
        if (!proposalState || !proposalState.validationErrors) return

        console.log('errr', proposalState.validationErrors)

        const keys = Object.keys(proposalState.validationErrors)
        if (keys.length === 0) return

        const firstKey = keys[0]

        const el = document.querySelector(`[name="${firstKey}"]`)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, [proposalState])

    if (!proposalState) return <p></p>


    const validateProposal = (proposalState) => {
        try {
            // Zod applies all nested validations and transforms
            const validatedData = proposalSchema.parse(proposalState)
            return { success: true, data: validatedData }
        } catch (err) {
            if (err instanceof z.ZodError) {
            // Flatten errors for easier mapping to UI
            const fieldErrors = err.flatten()
            return { success: false, errors: fieldErrors }
            }
            throw err
        }
    }

   const mapZodErrors = (zodError) => {
    const errors = {}
    zodError.issues.forEach(err => {  // <-- use .issues, not .errors
        const path = err.path.length ? err.path.join('.') : '_root'
        errors[path] = err.message
    })
    return errors
}

   const handleSubmit = (e) => {
        e.preventDefault()

        const result = proposalSchema.safeParse(proposalState)

        if (!result.success) {
            const formattedErrors = mapZodErrors(result.error) // use issues now
            console.log('formatted', formattedErrors)
            dispatch({ type: 'SET_VALIDATION_ERRORS', payload: formattedErrors })
            return
        }

        dispatch({ type: 'CLEAR_VALIDATION_ERRORS' })
        console.log('VALID DATA:', result.data)
    }
    
     return(
        
        <ChildLayout>
            
            <CreateProposalHead 
            dispatch={dispatch}
            errors={proposalState.validationErrors}
            />

            <Container>

                <CreateProposalBody proposalState={proposalState} dispatch={dispatch}  errors={proposalState.validationErrors}/>
        
            </Container>

            <Container fit='medium'>

                <div className={styles['proposal-submit-container']}>
                    <Button
                    label='Publish'
                    color='red'
                    size ='md'
                    />

                    <Button
                        label='Save Draft'
                        color='dark'
                        size ='md'
                        onClick={handleSubmit}
                    />
                </div>

            </Container>


        </ChildLayout>
    )
}


