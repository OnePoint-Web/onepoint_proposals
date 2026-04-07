import styles from '../page.module.scss'
import Input from '@/components/ui/input/Input'

export default function PriceSection({dispatch, proposalState}){

    const getDiscountConfig = () => {
        switch (proposalState.discountType) {
            case 'None':
                return { disabled: true, max: 0 }
            case 'Percentage':
                return { disabled: false, max: 100 }
            case 'Fixed':
                return { disabled: false, max: undefined }
            default:
                return { disabled: true, max: 0 }
        }
    }

    const discountConf = getDiscountConfig()

    return(
         <div className={styles['proposal-body-child']}>
            
            <div className={`${styles['child-container']} ${styles['pricing']}`}>
                <p>Pricing and Tax</p>

                    <table>
                        <tbody>
                           {proposalState && proposalState.proposalType !== 'SLA Proposal' ? (
                            <>
                                <tr>
                                    <td><div className={styles['cell-content']}><p className={styles['pricing-text']}>Subtotal:</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.subtotal || 0}`}</p></td>    
                                </tr>

                                <tr>
                                    <td>
                                        <div className={styles['cell-content']}>
                                            <p className={styles['pricing-text']}>
                                                -- Item discounts:
                                            </p> 
                                            
                                            <p className={styles['pricing-text']}>-</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.totalEnteredItemDiscount || 0}`}</p></td>    
                                </tr>

                            </>
                            )
                            :

                            (
                            <tr>
                                <td>
                                    <Input
                                        label='SLA Package Price:'
                                        placeholder='Enter price...'   
                                        value={proposalState.basePrice ?? 0}
                                        type='number' 
                                        onChange={(e) => {
                                        dispatch({
                                            type: "UPDATE_PROPOSAL_FIELD",
                                            payload: {basePrice: Number(e.target.value)}
                                        })
                                    }}
                                    />
                                </td>
                            </tr>
                                
                            )
                            
                            }

                            <tr>
                                    <td>
                                        <div className={styles['cell-content']}>
                                            <p className={styles['pricing-text']}>
                                                -- Global discount:
                                            </p> 
                                            
                                            <p className={styles['pricing-text']}>-</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.totalEnteredGlobalDiscount || 0}`}</p></td>    

                                </tr>

                                <tr>
                                    <td>
                                        <div className={styles['cell-content']}>
                                            <p className={styles['pricing-text']}>
                                                Total discount:
                                            </p> 
                                            
                                            <p className={styles['pricing-text']}>-</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.totalDiscountAmount || 0}`}</p></td>    
                                </tr>

                                <tr>
                                    <td>
                                        <div className={styles['cell-content']}>
                                            <p className={styles['pricing-text']}>
                                                Applied discount:
                                            </p> 
                                            
                                            <p className={styles['pricing-text']}>-</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.totalAppliedDiscount || 0}`}</p></td>    
                                </tr>

                                <tr>
                                    <td>
                                        <div className={styles['cell-content']}>
                                            <p className={styles['pricing-text']}>
                                                After discounts:
                                            </p> 
                                            
                                            <p className={styles['pricing-text']}>-</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.afterGlobalDiscount || 0}`}</p></td>    
                                </tr>


                            <tr>
                                <td><div className={styles['cell-content']}><p className={styles['pricing-text']}>+ (%10) GST:</p><p className={styles['pricing-text']}>+</p></div></td>
                                <td><p className={styles['pricing-values']}>{`$ ${proposalState.taxAmount || 0}`}</p></td>    
                            </tr>

                            <tr>
                                <td><div className={styles['cell-content']}><p className={styles['pricing-text']}>Grand total:</p></div></td>
                                <td><p className={styles['pricing-values']}>{`$ ${proposalState.finalPrice || 0}`}</p></td>    
                            </tr>
                        </tbody>
                    </table>
                
            </div>

            <hr></hr>

            <div className={styles['child-container']}>
                <p>Discount</p>

                <Input
                label='Discount Type' 
                type='select'
                values={[
                    {id: 'None', name: 'No Discount'},
                    {id: 'Fixed', name: 'Fixed Amount'},
                    {id: 'Percentage', name: '(%) Percentage'}
                ]}
                onChange={(e) => {
                    dispatch({
                        type: "UPDATE_PROPOSAL_FIELD",
                        payload: {discountType: e.target.value, discountValue: 0}
                    })
                }}
                />

                <Input
                key={proposalState.discountType + proposalState.id}
                label='Discount Value' 
                placeholder='0'
                type='number'
                value={proposalState.discountValue ?? 0}
                disabled={discountConf.disabled}
                max={discountConf.max}
                onChange={(e) => {
                    dispatch({
                        type: "UPDATE_PROPOSAL_FIELD",
                        payload: {discountValue: e.target.value}
                    })
                }}
                />

                <Input
                    key={proposalState.discountType}
                    label='Discount Description:'
                    width='medium'
                    type='textarea'
                    disabled={discountConf.disabled}
                    placeholder='Voucher, promo, sale...'
                    onChange={(e) => {
                        dispatch({
                            type: "UPDATE_PROPOSAL_FIELD",
                            payload: {discountDescription: e.target.value}
                        })
                }}
                />


                
            </div>
            
        </div>
    )
}