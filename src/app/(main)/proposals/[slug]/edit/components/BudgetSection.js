import styles from './components.module.scss'
import Input from '@/components/ui/input/Input'

export default function PriceSection({dispatch, proposalState}){

    const getDiscountConfig = () => {
        switch (proposalState.offer.discountType) {
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
            
            <div className={`${styles['table-container']} ${styles['pricing']}`}>
                <p>Pricing and Tax</p>
                    
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <Input
                                        label='Client Type:'
                                        type='select'
                                        value={proposalState.clientType}
                                        values={[
                                            {id: 'Taxable', name: 'Taxable (+10% GST)'},
                                            {id: 'Non-Taxable', name: 'Non-taxable'},
                                        ]}
                                        onChange={(e) => {
                                        dispatch({
                                                type: 'SET_CLIENT_TYPE',
                                                payload: e.target.value
                                            })
                                        }}
                                    />
                                </td>
                            </tr>
                            
                           {proposalState && proposalState.proposalType !== 'SLA Proposal' ? (
                            <>
                                <tr>
                                    <td><div className={styles['cell-content']}><p className={styles['pricing-text']}>Subtotal:</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.offer.subTotal || 0}`}</p></td>    
                                </tr>

                                <tr>
                                    <td>
                                        <div className={styles['cell-content']}>
                                            <p className={styles['pricing-text']}>
                                                -- Item discounts:
                                            </p> 
                                            
                                            <p className={styles['pricing-text']}>-</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.offer.totalEnteredItemDiscount || 0}`}</p></td>    
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
                                        value={proposalState.offer.basePrice || 0}
                                        type='number' 
                                        onChange={(e) => {
                                        dispatch({
                                            type: "UPDATE_PRICING_FIELD",
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
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.offer.totalEnteredGlobalDiscount || 0}`}</p></td>    

                                </tr>

                                <tr>
                                    <td>
                                        <div className={styles['cell-content']}>
                                            <p className={styles['pricing-text']}>
                                                Total discount:
                                            </p> 
                                            
                                            <p className={styles['pricing-text']}>-</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.offer.totalDiscountAmount || 0}`}</p></td>    
                                </tr>

                                <tr>
                                    <td>
                                        <div className={styles['cell-content']}>
                                            <p className={styles['pricing-text']}>
                                                Applied discount:
                                            </p> 
                                            
                                            <p className={styles['pricing-text']}>-</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.offer.totalAppliedDiscount || 0}`}</p></td>    
                                </tr>

                                <tr>
                                    <td>
                                        <div className={styles['cell-content']}>
                                            <p className={styles['pricing-text']}>
                                                After discounts:
                                            </p> 
                                            
                                            <p className={styles['pricing-text']}>-</p></div></td>
                                    <td><p className={styles['pricing-values']}>{`$ ${proposalState.offer.afterGlobalDiscount || 0}`}</p></td>    
                                </tr>

                            <tr>
                                <td><div className={styles['cell-content']}><p className={styles['pricing-text']}>+ (%10) GST:</p><p className={styles['pricing-text']}>+</p></div></td>
                                <td><p className={styles['pricing-values']}>{`$ ${proposalState.offer.taxAmount || 0}`}</p></td>    
                            </tr>

                            <tr>
                                <td><div className={styles['cell-content']}><p className={styles['pricing-text']}>Grand total:</p></div></td>
                                <td><p className={styles['pricing-values']}>{`$ ${proposalState.offer.finalPrice || 0}`}</p></td>    
                            </tr>
                        </tbody>
                    </table>
                
            </div>

            <hr></hr>

            <div className={styles['table-container']}>
                <p>Discount</p>

                <Input
                label='Discount Type' 
                type='select'
                value={proposalState.offer.discountType}
                values={[
                    {id: 'None', name: 'No Discount'},
                    {id: 'Fixed', name: 'Fixed Amount'},
                    {id: 'Percentage', name: '(%) Percentage'}
                ]}
                onChange={(e) => {
                    dispatch({
                        type: "UPDATE_PRICING_FIELD",
                        payload: {discountType: e.target.value, discountValue: 0}
                    })
                }}
                />

                <Input
                key={proposalState.offer.discountType + proposalState.id}
                label='Discount Value' 
                placeholder='0'
                type='number'
                value={proposalState.offer.discountValue ?? 0}
                disabled={discountConf.disabled}
                max={discountConf.max}
                onChange={(e) => {
                    dispatch({
                        type: "UPDATE_PRICING_FIELD",
                        payload: {discountValue: e.target.value}
                    })
                }}
                />

                <Input
                    key={proposalState.offer.discountType}
                    label='Discount Description:'
                    width='medium'
                    type='textarea'
                    disabled={discountConf.disabled}
                    placeholder='Voucher, promo, sale...'
                    onChange={(e) => {
                            dispatch({
                                type: "UPDATE_PRICING_FIELD",
                                payload: {discountDescription: e.target.value}
                            })
                    }}
                />


                
            </div>
            
        </div>
    )
}