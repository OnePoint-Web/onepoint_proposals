'use client'
import styles from './page.module.scss'
import ChildLayout from "@/components/layout/ChildLayout/ChildLayout";
import Container from "@/components/layout/Container/Container.js"
import MemberCard from '@/components/ui/member-card/MemberCard.js'
import DOMPurify from 'isomorphic-dompurify'
import VideoPlayer from '@/components/ui/video-player/VideoPlayer'
import ProposalPageHead from './components/ProposalPageHead'
import {useMemo} from 'react'

export default function ProposalPage({proposalData, slug}){

    console.log(proposalData)
    const execSummary = useMemo(() => {
        return DOMPurify.sanitize(proposalData.executiveSummary ?? "");
    }, [proposalData.executiveSummary]);

    const goalsAndObjectives = useMemo(() => {
        return DOMPurify.sanitize(proposalData.goalsAndObjectives ?? "");
    }, [proposalData.goalsAndObjectives]);

    const proposedSolution = useMemo(() => {
        return DOMPurify.sanitize(proposalData.proposedSolution ?? "");
    }, [proposalData.proposedSolution]);

    console.log(proposalData)


    const calculateItemDiscounts = (offers) => {

        const totalDiscountValue = offers.reduce((sum, item) => {
            let discount = 0;

            if(item.itemDiscountType === 'Percentage'){
                discount = item.totalPrice * (item.itemDiscountValue / 100)
            }

            if (item.itemDiscountType === 'Fixed') {
                discount = item.itemDiscountValue
            }

            return sum + discount
        }, 0)

        return totalDiscountValue
    }


    return(
        <ChildLayout>

            <ProposalPageHead
                proposalData={proposalData}
            />
            
            <Container>
                <div className={styles['proposal-container']}>
                    <h2>
                        Executive Summary
                    </h2>

                    {proposalData.execVideoUrl && (
                        <>
                            <div className={styles['video-container']}>
                                <VideoPlayer
                                    url={proposalData.execVideoUrl}
                                    size='full'
                                />
                            </div>

                            <hr></hr>
                        </>
                        
                    )} 

                        <div className={styles['rich-text']} dangerouslySetInnerHTML={{ __html: execSummary }}>

                        </div>

                        <hr></hr>

                        <h2>
                            Goals and Objectives
                        </h2>

                        <div className={styles['rich-text']} dangerouslySetInnerHTML={{ __html: goalsAndObjectives }}>

                        </div>

                        <hr></hr>

                        <h2>
                            Proposed Solution
                        </h2>

                        <div className={styles['rich-text']} dangerouslySetInnerHTML={{ __html: proposedSolution }}>

                        </div>

                        <hr></hr>

                        <h2>
                            The Team
                        </h2>

                        <div className={styles['team-container']}>

                            {proposalData.selectedMembers.map((m, i) => (
                                <MemberCard
                                    key={i}
                                    image={m.teamMember.memberImage}
                                    name={m.teamMember.memberName}
                                    role={m.teamMember.memberRole}
                                    description={m.teamMember.description}
                                />
                            ))}
                        
                        </div>

                        <hr></hr>

                        <h2>
                            Project Timeline
                        </h2>

                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        <p>Timeframe</p>
                                    </th>
                                    <th>
                                        <p>Assigned to</p>
                                    </th>

                                    <th className={styles['progress-column']}>
                                        <p>Progress</p>
                                    </th>

                                    <th>
                                        <p>Task</p>
                                    </th>
                                </tr>

                                {proposalData.timelines
                                    .sort((a, b) => a.progress - b.progress)
                                    .map((t) => (
                                        <tr key={t.timelineId}>
                                            <td>
                                                <p>{t.timeFrame}</p>
                                            </td>
                                            <td>
                                                <p>{t.assignedTo}</p>
                                            </td>
                                            <td>
                                                <div className={styles['progress-bar']}>
                                                <p className={styles['progress']}>{t.progress}%</p>

                                                <div
                                                    className={styles['slidebar']}
                                                    style={{ width: `${t.progress}%` }}
                                                >
                                                    {t.progress >= 10 && (
                                                    <p className={styles['progress-white']}>
                                                        {t.progress}%
                                                    </p>
                                                    )}
                                                </div>
                                                </div>
                                            </td>
                                            <td>
                                                <ul>
                                                {t.timelineScopeItems.map(i => (
                                                    <li key={i.scopeItemId}>
                                                    <p>{i.scope}</p>
                                                    </li>
                                                ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                         <hr></hr>

                        <h2>
                           Proposed Budget
                        </h2>
                        {proposalData.proposalType === 'SLA Proposal' && 
                            ( 
                                <>
                                    <div className={styles['price-section']}>
                                        <p className={styles['budget-section-head']}><span>{proposalData.slaOffers[0].slaPackage}</span> (Inclusions may be the following items below)</p>
                                        <div className={styles['inclusions-container']}>
                                            {proposalData.slaOffers[0].packageDealItem.map((item, index) => {
                                                return item.itemType === 'Paragraph' ? (
                                                    <div key={item.packageDealItemId} className={`${styles['deal-container']} ${styles['paragraph']}`}>
                                                    <p className={styles['item-header']}>{item.item}</p>
                                                    <p>{item.packageDealEntries[0].itemEntry}</p>
                                                    </div>
                                                ) : (
                                                    <div key={item.packageDealItemId} className={`${styles['deal-container']}`}>
                                                    <p className={styles['item-header']}>{item.item}</p>
                                                    <ul>
                                                        {item.packageDealEntries.map(entries => (
                                                        <li key={entries.itemEntryId}>{entries.itemEntry}</li>
                                                        ))}
                                                    </ul>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <p className={styles['budget-section-foot']}><span>{proposalData.proposalDescription}</span></p>
                                    </div>
                                    
                                    <div className={styles['price-table']}>

                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className={styles['price-label']}>
                                                        <p className={styles['label']}>Package price:</p>
                                                    </td>

                                                    <td className={styles['center-cell']}>
                                                        <p className={styles['description']}></p>
                                                    </td>

                                                    <td className={styles['price-value']}>
                                                        <p>$ {proposalData.slaOffers[0].basePrice}</p>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className={styles['price-label']}>
                                                        <p className={styles['label']}>Discount:</p>
                                                    </td>

                                                    <td className={styles['center-cell']}>
                                                        <p className={styles['description']}>
                                                        ({proposalData.slaOffers[0].discountReason})
                                                        </p>
                                                    </td>

                                                    <td className={styles['price-value']}>
                                                        <p>- $ {proposalData.slaOffers[0].discountValue}</p>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className={styles['price-label']}>
                                                        <p className={styles['label']}>GST:</p>
                                                    </td>

                                                    <td className={styles['center-cell']}>
                                                        <p className={styles['description']}></p>
                                                    </td>

                                                    <td className={styles['price-value']}>
                                                        <p>+ $ {proposalData.slaOffers[0].taxAmount}</p>
                                                    </td>
                                                </tr>

                                                <tr className={styles['last-row']}>
                                                    <td className={styles['price-label']}>
                                                        <p className={styles['label']}>Total:</p>
                                                    </td>

                                                    <td className={styles['center-cell']}>
                                                        <p className={styles['description']}></p>
                                                    </td>

                                                    <td className={styles['price-value']}>
                                                        <p className={styles['final-price']}>
                                                        $ {proposalData.slaOffers[0].finalPrice}
                                                        </p>
                                                    </td>
                                                </tr>         
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                            
                            {proposalData.proposalType !== 'SLA Proposal' && (
                                <>
                                {proposalData.serviceProductOffers[0].isMultipleChoice && (
                                    <div className={styles['multiple-choice-notice']}>
                                        <p>Multiple Choice Proposal — client may select individual items before approving.</p>
                                    </div>
                                )}
                                <table className={styles['product-service-table']}>
                                    <tbody>
                                    <tr>
                                        <th className={styles['item']}>
                                            <p>Item</p>
                                        </th>
                                        <th className={styles['description']}>
                                            <p>Description</p>
                                        </th>

                                        <th >
                                            <p>Item Price</p>
                                        </th>

                                        {proposalData.proposalType === 'Product Proposal' &&
                                            <>
                                                <th>
                                                    <p>Qty</p>
                                                </th>
                                            

                                                <th>
                                                    <p>Subtotal</p>
                                                </th>
                                            </>
                                        }

                                        <th>
                                            <p>Item Discount</p>
                                        </th>

                                        <th>
                                            <p>Total</p>
                                        </th>

                                        {proposalData.serviceProductOffers[0].isMultipleChoice && (
                                            <th className={styles['center']}>
                                                <p>Selected</p>
                                            </th>
                                        )}
                                    </tr>

                                    {
                                        proposalData.serviceProductOffers[0].offerEntries.map(entry => (
                                            <tr key={entry.offerEntryId} className={styles['data-row']}>
                                                <th>
                                                    <p>{entry.serviceProductItem}</p>
                                                </th>

                                                <th>
                                                    <p>{entry.description}</p>
                                                </th>

                                                <th className={styles['center']}>
                                                    <p>{`$ ${entry.itemPrice}`}</p>
                                                </th>

                                                {proposalData.proposalType === 'Product Proposal' &&
                                                <>
                                                    <th className={styles['center']}>
                                                        <p>{entry.quantity}</p>
                                                    </th>

                                                    <th className={styles['center']}>
                                                        <p>{entry.totalPrice}</p>
                                                    </th>
                                                </>
                                                    
                                                }
                                                

                                                <th className={styles['center']}>
                                                    {entry.itemDiscountType === 'Fixed' && (
                                                        <>
                                                         <p>{`- $ ${entry.itemDiscountValue}`}</p>
                                                        <p className={styles['discount-description']}>({entry.itemDiscountDescription})</p>
                                                        </>
                                            
                                                    )}
                                                    {entry.itemDiscountType === 'Percentage' && (
                                                        <>
                                                            <p>{`- % ${entry.itemDiscountValue}`}</p>
                                                            <p className={styles['discount-description']}>({entry.itemDiscountDescription})</p>
                                                        </>
                                                        
                                                    )}

                                                    {entry.itemDiscountType === 'None' && (
                                                        <>
                                                            <p>- -</p>
                                                        </>
                                                        
                                                    )}
                                                    
                                                </th>   

                                                <th className={styles['center']}>

                                                    {entry.itemDiscountType === 'Fixed' && (
                                                        <p>{`$ ${entry.totalPrice - entry.itemDiscountValue}`}</p>
                                                    )}
                                                    {entry.itemDiscountType === 'Percentage' && (
                                                        <p>{`$ ${entry.totalPrice - ((entry.itemDiscountValue/100)*entry.totalPrice)}`}</p>
                                                    )}
                                                    {entry.itemDiscountType === 'None' && (
                                                        <p>{`$ ${entry.totalPrice}`}</p>
                                                    )}

                                                </th>

                                                {proposalData.serviceProductOffers[0].isMultipleChoice && (
                                                    <th className={styles['center']}>
                                                        <p style={{ color: entry.isSelected !== false ? '#22C55E' : '#A0AEC0', fontWeight: 600 }}>
                                                            {entry.isSelected !== false ? 'Yes' : 'No'}
                                                        </p>
                                                    </th>
                                                )}
                                            </tr>
                                        ))
                                    }

                                    <tr  className={styles['data-row']}>
                                        <th>
                                        </th>

                                        <th>
                                        </th>

                                        <th className={styles['center']}>
                                        </th>

                                        {proposalData.proposalType === 'Product Proposal' &&
                                        <>
                                            <th className={styles['center']}>
                                            </th>
                                            <th className={styles['center']}>
                                            </th>
                                        </>
                                            
                                        }
                                        

                                        <th className={styles['center']}>
                                            <p className={styles['subtotal-text']}>Subtotal: </p>
                                        </th>   

                                        <th className={styles['center']}>
                                                <p className={styles['subtotal-text']}>{`$ ${proposalData.serviceProductOffers[0].subTotal - calculateItemDiscounts(proposalData.serviceProductOffers[0].offerEntries)}`}</p>
                                        </th>
                                    </tr>
                                    </tbody>
                                </table>

                                   <div className={styles['price-table']}>
                                     <table>
                                            <tbody>
                                                <tr>
                                                    <td className={styles['price-label']}>
                                                        <p className={styles['label']}>Subtotal:</p>
                                                    </td>

                                                    <td className={styles['center-cell']}>
                                                        <p className={styles['description']}></p>
                                                    </td>

                                                    <td className={styles['price-value']}>
                                                        <p>$ {proposalData.serviceProductOffers[0].subTotal}</p>
                                                    </td>
                                                </tr>

                                                

                                                    {calculateItemDiscounts(proposalData.serviceProductOffers[0].offerEntries) !== 0 && (
                                                        <>
                                                        <tr>
                                                            <td className={styles['price-label']}>
                                                                <p className={styles['label']}>Item discounts:</p>
                                                            </td>

                                                            <td className={styles['center-cell']}>
                                                                <p className={styles['description']}>
                
                                                                </p>
                                                            </td>
                                                            <td className={styles['price-value']}>
                                                                
                                                                    <p>- $ {calculateItemDiscounts(proposalData.serviceProductOffers[0].offerEntries) }</p>
                                                                
                                                            </td>
                                                        </tr>
                                                        </>
                                                        )
                                                    }

                                                    {proposalData.serviceProductOffers[0].discountType !== 'None' && (
                                                        <>
                                                        <tr>
                                                            <td className={styles['price-label']}>
                                                                <p className={styles['label']}>Global discount:</p>
                                                            </td>

                                                            <td className={styles['center-cell']}>
                                                                <p className={styles['description']}>
                                                                    {proposalData.serviceProductOffers[0].discountReason && `(${proposalData.serviceProductOffers[0].discountReason})`}
                                                                </p>
                                                            </td>
                                                            <td className={styles['price-value']}>
                                                                {proposalData.serviceProductOffers[0].discountType === 'Fixed' &&
                                                                    <p>- $ {proposalData.serviceProductOffers[0].discountValue}</p>
                                                                }

                                                                {proposalData.serviceProductOffers[0].discountType === 'Percentage' &&
                                                                    <p>- $ {(proposalData.serviceProductOffers[0].discountValue/100) * (proposalData.serviceProductOffers[0].subTotal - calculateItemDiscounts(proposalData.serviceProductOffers[0].offerEntries))}</p>
                                                                }
                                                                
                                                            </td>
                                                        </tr>
                                                        </>
                                                        )
                                                    }
                                                    
                                                

                                                <tr>
                                                    <td className={styles['price-label']}>
                                                        <p className={styles['label']}>GST:</p>
                                                    </td>

                                                    <td className={styles['center-cell']}>
                                                        <p className={styles['description']}></p>
                                                    </td>

                                                    <td className={styles['price-value']}>
                                                        <p>+ $ {proposalData.serviceProductOffers[0].taxAmount}</p>
                                                    </td>
                                                </tr>

                                                <tr className={styles['last-row']}>
                                                    <td className={styles['price-label']}>
                                                        <p className={styles['label']}>Total:</p>
                                                    </td>

                                                    <td className={styles['center-cell']}>
                                                        <p className={styles['description']}></p>
                                                    </td>

                                                    <td className={styles['price-value']}>
                                                        <p className={styles['final-price']}>
                                                        $ {proposalData.serviceProductOffers[0].finalPrice}
                                                        </p>
                                                    </td>
                                                </tr>         
                                            </tbody>
                                        </table>


                                   </div>
                                       
                                </>
                            )}
                                

                        <hr></hr>

                        <h2>
                           Approval
                        </h2>

                        <div className={styles['approval-details']}>
                            <p className={styles['head']}>{proposalData.proposalTitle}</p>
                            <hr></hr>
                            <p className={styles['head']}>Client Details</p>
                            <p>Company: {proposalData.clientProfile.companyAddress}</p>
                            <p>Client: {`${proposalData.clientProfile.user.firstName} ${proposalData.clientProfile.user.lastName}`}</p>
                            <p>Email: {proposalData.clientProfile.user.userEmail}</p>
                            <p>Website: {proposalData.clientProfile.website}</p>
                        </div>
                        
                    
                </div>
            </Container>
        </ChildLayout>
    )
}