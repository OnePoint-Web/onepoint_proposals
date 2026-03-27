import styles from '../page.module.scss'
import Input from '@/components/ui/input/Input'

export default function PriceSection({dispatch, proposalState, proposalType}){

    return(
         <div className={styles['proposal-body-child']}>
            
            <div className={styles['child-container']}>
                <p>Pricing and Tax</p>
                <Input
                label='Subtotal:' 
                placeholder='0'
                value={`$ ${proposalState.subtotal || 0}`}
                disabled
                />

                <Input
                label='Total item discounts:' 
                placeholder='0'
                value={`- $ ${proposalState.totalItemDiscount || 0}`}
                disabled
                />

                <Input
                label='Subtotal - after service discounts:' 
                disabled
                value={`$ ${proposalState.baseAmount || 0}`}
                placeholder='0'
                />

                <Input
                label='Global discount amount:'
                placeholder='0'
                disabled
                value={`- $ ${proposalState.globalDiscountAmount || 0}`}
                />


                <Input
                label='Subtotal - after global discount:'
                placeholder='0'
                disabled
                value={`$ ${proposalState.afterGlobalDiscount || 0}`}
                />

                <Input
                label='Subtotal taxAmount'
                placeholder='0'
                disabled
                value={`$ ${proposalState.taxAmount || 0}`}
                />

                <Input
                label='Grand Total:' 
                placeholder='0'
                value={proposalState.finalPrice || 0}
                disabled
                />
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
                        payload: {discountType: e.target.value}
                    })
                }}
                />

                <Input
                label='Discount Value' 
                placeholder='0'
                onChange={(e) => {
                    dispatch({
                        type: "UPDATE_PROPOSAL_FIELD",
                        payload: {discountValue: e.target.value}
                    })
                }}
                />

                <Input
                    label='Discount Description:'
                    width='medium'
                    type='textarea'
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