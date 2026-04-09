"use client"
import Form, {FormInputContainer} from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import styles from './PackageCreationForm.module.scss'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.js'
import PackageDealSection from './PackageDealsSection'
import {useForm, Controller} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import {createPackageSchema} from '@/schemas/package/createPackage.schema.js'
import {dealsReducer} from '../reducers/packageDealReducer.js'
import {createInitialDeal} from '../reducers/factories'
import {useReducer, useState} from 'react'

export default function PackageCreationForm(){

    const [dealsState, dispatch] = useReducer(dealsReducer, createInitialDeal());
    const [price, setPrice] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register, 
        handleSubmit,   
        setValue,
        setError,
        reset,
        control,
        formState: { errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(createPackageSchema)
    })

    const prepareDealsForSubmit = (dealsState) =>
    dealsState.map((deal, dealIndex) => ({
        ...deal,
        display_order: dealIndex + 1,
        items: deal.items.map((item, itemIndex) => ({
        ...item,
        order: itemIndex + 1
        }))
    }));

    const onSubmit = async (data) => {
        if (isSubmitting) return

        
        const dealsPayload = prepareDealsForSubmit(dealsState).map(deal => ({
            dealItem: deal.item,
            itemType: deal.item_type,
            displayOrder: deal.display_order,
            dealEntries: {
                create: (deal.items || []).map(item => ({
                    itemEntry: item.entry,
                    displayOrder: item.order
                }))
            }
            }))

            const payload = {
            ...data,
            deals: {
                create: dealsPayload
            }
        }

        console.log(JSON.stringify(payload))

        try{
            const res = await fetch("/api/packages", {
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
            return
            }
                console.error(result)
                return
        }

        reset()
        setIsSuccess(true)
        console.log("Success:", result)

        }catch(err){
            setIsSuccess(false)
            console.error(err)
        }
    }

    return(
        <Form 
        header='Create New SLA Package'
        description='Create a new SLA package for SLA proposals'
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

        <PackageDealSection
            dealsState={dealsState}
            dispatch={dispatch}
        />

           { isSuccess && <p className={styles.success}>Package created successfully</p>}

            <Button 
                label={isSubmitting ? 'Creating package..' : 'Add Package'}
                size='xs'
                color='dark'
                action='submit'
                disabled={isSubmitting}
            />



        </Form>
    )
}

