'use client'
import styles from './page.module.scss'
import Form, {FormInputContainer} from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.js'
import Container from '@/components/layout/Container/Container'
import EditPackageDealSection from './components/PackageDealSection'
import {createPackageSchema} from '@/schemas/package/createPackage.schema.js'
import {useEffect, useState, useReducer} from 'react'
import {useForm, Controller} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import {dealsReducer} from './reducers/packageDealReducer.js'
import {useRouter} from 'next/navigation'

export default function EditPackagePage({packageData}){

    const router = useRouter()

    const [dealsState, dispatch] = useReducer(dealsReducer, null);
    const [price, setPrice] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false);
    const [toggleModal, setToggleModal] = useState(false);

    useEffect(() => {
        dispatch({
            type: 'INITIALIZE',
            payload: packageData.dealItems
        })

        setPrice(packageData.basePrice)
    },[])

    const {
            register, 
            handleSubmit,   
            setError,
            reset,
            control,
            formState: { errors, isSubmitting},
        } = useForm({
            resolver: zodResolver(createPackageSchema),

            defaultValues: {
                package: packageData.package || "",
                price: Number(packageData.basePrice) || 0,
                description: packageData.description || "",
                solution: packageData.proposedSolution || "",
        }
        })

    if(!dealsState) return <p>Loading Package Data</p>

    const prepareDealsForSubmit = (dealsState) => {
        const payload = dealsState.map((deal, dealIndex) => ({
            ...deal,
            displayOrder: dealIndex + 1,
            dealEntries: deal.dealEntries.map((item, itemIndex) => ({
                ...item,
                displayOrder: itemIndex + 1
            }))
        }))

        return payload
    }

    const cleanDeals = (dealsState) => {

        const payload = dealsState
            .map(deal => ({
                ...deal,
                dealItem: deal.item?.trim(),
                dealEntries: (deal.packageDealEntries || [])
                    .map(item => ({
                        ...item,
                        itemEntry: item.itemEntry?.trim()
                    }))
                    .filter(item => item.itemEntry) // remove empty entries
            }))
            .filter(deal => 
                deal.dealItem && deal.dealEntries.length > 0 // remove empty deals
            )

            return payload
    }
    
    const onSubmit = async (data) => {
        if (isSubmitting) return

        
        const cleanedDeals = cleanDeals(dealsState)

        const dealsPayload = prepareDealsForSubmit(cleanedDeals).map(deal => ({
            dealItem: deal.dealItem,
            itemType: deal.itemType,
            displayOrder: deal.displayOrder,
            dealEntries: deal.dealEntries.length > 0
                ? {
                    create: deal.dealEntries.map(item => ({
                        itemEntry: item.itemEntry,
                        displayOrder: item.displayOrder
                    }))
                }   
                : undefined // prevents empty create
        }))

        const payload = {
            ...data,
            packageId: packageData.packageId,
            dealItems: dealsPayload

        }

        try{
            const res = await fetch(`/api/packages/${packageData.slug}/edit`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
            })

        const result = await res.json()

        if (!res.ok) {
            if (result.field) {
            setError(result.field, {
                type: "server",
                message: result.message,
            })
            return
            }
                console.error(result)
                return
        }

        setToggleModal(true)

        setTimeout(() => {
            router.push('/packages')
        }, 1000)

        reset()
        setIsSuccess(true)

        }catch(err){
            setIsSuccess(false)
            console.error(err)
        }
    }

    
    

    return(
        <Container>
        <Form 
        header={`You are now editing ${packageData.package}`}
        onSubmit={handleSubmit(onSubmit)}
        >

        <fieldset className={styles['field-set']}>

            <FormInputContainer
                label='Package title'
            >
                <Input
                    label='Package title:'
                    width="medium"
                    hideLabel={true}
                    placeholder='Package name...'
                    error={errors.package ? 'error' : ''}
                    errorMessage={errors.package && errors.package.message}
                    rules={{...register("package")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Price'
            >

                <Input
                    label='Price'
                    type='number'
                    width="medium"
                    value={price ?? 0}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    hideLabel={true}
                    placeholder='Package price...'
                    error={errors.price ? 'error' : ''}
                    errorMessage={errors.price && errors.price.message}
                    rules={{...register("price")}}
                />
            </FormInputContainer>  

                <Input
                    label='Description:'
                    type='textarea'
                    width="full"
                    placeholder='Package description...'
                    error={errors.description ? 'error' : ''}
                    errorMessage={errors.description && errors.description.message}
                    rules={{...register("description")}}
                />
            
                <FormInputContainer
                label='Proposed Solution'
                />

            <Controller
                name="solution"
                control={control}
                render={({ field, fieldState }) => (
                    <RichTextEditor
                        placeholder='Package proposed solution...'
                        value={field.value || ''}            
                        onChange={field.onChange}  
                    />
                )}
            />         
            
        </fieldset>

        <EditPackageDealSection
            dealsState={dealsState}
            dispatch={dispatch}
        />

           { isSuccess && <p className={styles.success}>Package updated successfully</p>}

            <Button
                label={isSubmitting ? 'Updating package...' : 'Update Package'}
                size='xs'
                color='dark'
                action='submit'
                disabled={isSubmitting}
            />

            {toggleModal && 
                <SuccessModal
                    message='Package Updated!'
                    actionMessage={'Redirecting to packages list...'}
                />
            }
        </Form>
        </Container>
    )
}