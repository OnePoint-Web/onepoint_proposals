import styles from './components.module.scss'

function fmt(val) {
    const n = parseFloat(val ?? 0)
    return `$${n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function calcItemDiscounts(entries) {
    return entries.reduce((sum, e) => {
        if (e.itemDiscountType === 'Percentage') return sum + e.totalPrice * (e.itemDiscountValue / 100)
        if (e.itemDiscountType === 'Fixed') return sum + Number(e.itemDiscountValue)
        return sum
    }, 0)
}

function PricingTable({ rows, total, paymentTerms }) {
    return (
        <div>
            <div className={styles['pricing-summary']}>
                {rows.map((row, i) => (
                    <div key={i} className={styles['pricing-row']}>
                        <span className={styles['pricing-label']}>{row.label}</span>
                        <span className={styles['pricing-value']}>{row.value}</span>
                    </div>
                ))}
                <div className={styles['pricing-total']}>
                    <span>Total</span>
                    <span>{total}</span>
                </div>
            </div>
            {paymentTerms && (
                <div className={styles['payment-terms-box']}>
                    <strong>Payment Terms</strong>
                    {paymentTerms}
                </div>
            )}
        </div>
    )
}

export default function ProposedBudget({ proposal }) {
    const isSla = proposal.proposalType === 'SLA Proposal'
    const sla = proposal.slaOffers?.[0]
    const svc = proposal.serviceProductOffers?.[0]

    return (
        <div className={styles.section}>
            <div className={styles['budget-body']}>
                <div className={styles['section-head']}>
                    <p className={styles['section-title']}>PROPOSED BUDGET</p>
                    <hr />
                </div>

                {isSla && sla && (
                    <>
                        <p className={styles['budget-package-title']}>
                            Package: <span>{sla.slaPackage}</span>
                        </p>
                        <p className={styles['budget-hint']}>Inclusions may include the following items:</p>

                        <div className={styles['inclusions-grid']}>
                            {sla.packageDealItem?.map((item) =>
                                item.itemType === 'Paragraph' ? (
                                    <div key={item.packageDealItemId} className={`${styles['inclusion-box']} ${styles['full-width']}`}>
                                        <p className={styles['inclusion-title']}>{item.item}</p>
                                        <p className={styles['inclusion-paragraph']}>
                                            {item.packageDealEntries[0]?.itemEntry}
                                        </p>
                                    </div>
                                ) : (
                                    <div key={item.packageDealItemId} className={styles['inclusion-box']}>
                                        <p className={styles['inclusion-title']}>{item.item}</p>
                                        <ul className={styles['inclusion-list']}>
                                            {item.packageDealEntries.map((e) => (
                                                <li key={e.itemEntryId}>{e.itemEntry}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            )}
                        </div>

                        {proposal.proposalDescription && (
                            <p className={styles['description-box']}>{proposal.proposalDescription}</p>
                        )}

                        <PricingTable
                            rows={[
                                { label: 'Package Price', value: fmt(sla.basePrice) },
                                ...(sla.discountType !== 'None' && sla.discountValue
                                    ? [{ label: `Discount${sla.discountDescription ? ` (${sla.discountDescription})` : ''}`, value: `− ${fmt(sla.discountValue)}` }]
                                    : []),
                                ...(sla.taxApplicable
                                    ? [{ label: `GST (${sla.taxRate}%)`, value: `+ ${fmt(sla.taxAmount)}` }]
                                    : []),
                            ]}
                            total={fmt(sla.finalPrice)}
                            paymentTerms={sla.paymentTerms}
                        />
                    </>
                )}

                {!isSla && svc && (
                    <>
                        {svc.isMultipleChoice && (
                            <p className={styles['multiple-choice-notice']}>
                                This proposal allows the client to select their desired items before approval.
                            </p>
                        )}
                        <table className={styles['items-table']}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Description</th>
                                    <th style={{ textAlign: 'right' }}>Price</th>
                                    {proposal.proposalType === 'Product Proposal' && (
                                        <>
                                            <th style={{ textAlign: 'right' }}>Qty</th>
                                            <th style={{ textAlign: 'right' }}>Subtotal</th>
                                        </>
                                    )}
                                    <th style={{ textAlign: 'right' }}>Discount</th>
                                    <th style={{ textAlign: 'right' }}>Total</th>
                                    {svc.isMultipleChoice && (
                                        <th style={{ textAlign: 'center' }}>Selected</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {svc.offerEntries?.map((entry) => {
                                    const discounted =
                                        entry.itemDiscountType === 'Fixed'
                                            ? entry.totalPrice - entry.itemDiscountValue
                                            : entry.itemDiscountType === 'Percentage'
                                            ? entry.totalPrice - (entry.itemDiscountValue / 100) * entry.totalPrice
                                            : entry.totalPrice
                                    const isEntrySelected = entry.isSelected !== false

                                    return (
                                        <tr key={entry.offerEntryId} style={svc.isMultipleChoice && !isEntrySelected ? { opacity: 0.45 } : undefined}>
                                            <td>{entry.serviceProductItem}</td>
                                            <td>{entry.description || '—'}</td>
                                            <td className={styles.center}>{fmt(entry.itemPrice)}</td>
                                            {proposal.proposalType === 'Product Proposal' && (
                                                <>
                                                    <td className={styles.center}>{entry.quantity}</td>
                                                    <td className={styles.center}>{fmt(entry.totalPrice)}</td>
                                                </>
                                            )}
                                            <td className={styles.center}>
                                                {entry.itemDiscountType === 'None' || !entry.itemDiscountType ? '—' : (
                                                    <>
                                                        {entry.itemDiscountType === 'Fixed'
                                                            ? `− ${fmt(entry.itemDiscountValue)}`
                                                            : `− ${entry.itemDiscountValue}%`}
                                                        {entry.itemDiscountDescription && (
                                                            <span className={styles['discount-note']}>
                                                                ({entry.itemDiscountDescription})
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                            <td className={styles.center}>{fmt(discounted)}</td>
                                            {svc.isMultipleChoice && (
                                                <td className={styles.center} style={{ color: isEntrySelected ? '#22C55E' : '#A0AEC0', fontWeight: 600 }}>
                                                    {isEntrySelected ? 'Selected' : 'Not selected'}
                                                </td>
                                            )}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        <PricingTable
                            rows={[
                                { label: 'Subtotal', value: fmt(svc.subTotal) },
                                ...(calcItemDiscounts(svc.offerEntries ?? []) > 0
                                    ? [{ label: 'Item Discounts', value: `− ${fmt(calcItemDiscounts(svc.offerEntries))}` }]
                                    : []),
                                ...(svc.discountType !== 'None' && svc.discountValue
                                    ? [{
                                        label: `Global Discount${svc.discountDescription ? ` (${svc.discountDescription})` : ''}`,
                                        value: svc.discountType === 'Fixed'
                                            ? `− ${fmt(svc.discountValue)}`
                                            : `− ${fmt((svc.discountValue / 100) * (svc.subTotal - calcItemDiscounts(svc.offerEntries ?? [])))}`,
                                    }]
                                    : []),
                                ...(svc.taxApplicable
                                    ? [{ label: `GST (${svc.taxRate}%)`, value: `+ ${fmt(svc.taxAmount)}` }]
                                    : []),
                            ]}
                            total={fmt(svc.finalPrice)}
                            paymentTerms={svc.paymentTerms}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
