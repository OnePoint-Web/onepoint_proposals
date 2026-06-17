"use client"
import Form, {FormInputContainer} from '@/components/ui/form/Form.js'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import ImageUploadAndPreview from './ImageUploadAndPreview'
import styles from './CreateMemberForm.module.scss'
import {useState, useEffect} from 'react'
import {useForm} from "react-hook-form"
import { useParams, useRouter } from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import {createMemberSchema} from '@/schemas/member/createMember.schema.js'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import {Icons} from '@/components/icons/icons.js'
const MemberIcon = Icons.teamIcon

export default function CreateMemberForm(){
    const params = useParams()
    const router = useRouter()

    const {id} =  params
    const [isSuccess, setIsSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null)
    const [imageRemoved, setImageRemoved] = useState(false)
    const [member, setMember] = useState({})
    const [toggleModal, setToggleModal] = useState(false)

     useEffect(() => {
        fetch(`/api/members/${id}`)
        .then(res => res.json())
        .then(result => {
            const memberData = result.data
            setMember(memberData)

            reset({
                member_name: memberData.memberName,
                role: memberData.memberRole,
                description: memberData.description,
            })
        })
    }, [])

    const {
        register, 
        handleSubmit,   
        setValue,
        setError,
        reset,
        formState: { errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(createMemberSchema)
    })

    const onSubmit = async (data) => {
        try {
            const formData = new FormData()

            Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value)
            })

            if (imageFile && imageFile.size > 15_000_000) {
            alert("Image is too large. File size must not exceed 15MB")
            return
            }

            if (imageFile) {
            formData.append('image', imageFile)
            } else if (imageRemoved) {
            formData.append('removeImage', 'true')
            }

            const res = await fetch(`/api/members/${id}/edit`, {
                method: 'PATCH',
                body: formData
            })

            const result = await res.json()

            if (!res.ok) {
                console.log(result)
                return
            }

            reset()
            setImageFile(null)
            setIsSuccess(true)
            setToggleModal(true)

            setTimeout(() => {
                router.push(`/teams-and-members/${id}`)
            }, 1000)

        } catch (err) {
            console.error(err)
            setIsSuccess(false)
        }
    }

    return(
        <Form 
        header={`Editing ${member.memberName}`}
        onSubmit={handleSubmit(onSubmit)}>

        <fieldset className={styles['field-set']}>

            <FormInputContainer
                label='Member Name'
            >
                <Input
                    label='Member name:'
                    width="medium"
                    type='text'
                    hideLabel={true}
                    placeholder='Full Name...'
                    error={errors.member_name ? 'error' : ''}
                    errorMessage={errors.member_name && errors.member_name  .message}
                    rules={{...register("member_name")}}
                />
            </FormInputContainer>
            

            <FormInputContainer
                label='Role'
            >

                <Input
                    label='Role'
                    width="medium"
                    hideLabel={true}
                    placeholder='Member role/position...'
                    error={errors.role ? 'error' : ''}
                    errorMessage={errors.role && errors.role.message}
                    rules={{...register("role")}}
                />
            </FormInputContainer>

            <FormInputContainer
                label='Description'
            >

                <Input
                    label='Description'
                    width="medium"
                    hideLabel={true}
                    placeholder='Member description...'
                    error={errors.description ? 'error' : ''}
                    errorMessage={errors.description && errors.description.message}
                    rules={{...register("description")}}
                />
            </FormInputContainer> 
            
        </fieldset>

        <fieldset className={styles['field-set']}>

            <hr></hr>
            <h3>Edit Member Image</h3>
            <p>Image file must not exceed 15MB (350 x 500 px recommended)</p>

            <ImageUploadAndPreview
                onFileSelect={(file) => { setImageFile(file); setImageRemoved(false) }}
                onRemove={() => { setImageFile(null); setImageRemoved(true) }}
                initialImage={member.memberImage}
            />
                
        </fieldset >

           { isSuccess && <p className={styles.success}>Member updated successfully</p>}

            <Button 
                label={isSubmitting ? 'Updating Member..' : 'Confirm Changes'}
                size='xs'
                color='dark'
                action='submit'
                disabled={isSubmitting}
            />

            {toggleModal && (
            
                <SuccessModal
                    onClick={(e) => e.stopPropagation()}
                    icon={MemberIcon}
                    message='Member Successfully Updated!'
                    actionMessage=''
                />
            )}

        </Form>
    )
}

