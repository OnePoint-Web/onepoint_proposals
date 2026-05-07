'use client'
import styles from './page.module.scss'
import ChildLayout from "@/components/layout/ChildLayout/ChildLayout";
import Container from "@/components/layout/Container/Container.js"
import MemberCard from '@/components/ui/member-card/MemberCard.js'
import DOMPurify from 'dompurify'
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

                                        <p className={styles['budget-section-foot']}><span>{proposalData.description}</span></p>
                                    </div>
                                </>
                            )}
                            
                            {proposalData.proposalType !== 'SLA Proposal' && (
                                <>
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

                                        <th>
                                            <p>Qty</p>
                                        </th>

                                        <th>
                                            <p>Subtotal</p>
                                        </th>

                                        <th>
                                            <p>Item Discount</p>
                                        </th>

                                        <th>    
                                            <p>Total</p>
                                        </th>
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

                                                <th className={styles['center']}>
                                                    <p>{entry.quantity}</p>
                                                </th>

                                                <th className={styles['center']}>
                                                    <p>{entry.totalPrice}</p>
                                                </th>

                                                <th className={styles['center']}>
                                                    {entry.itemDiscountType === 'Fixed' && (
                                                        <p>{`$ ${entry.itemDiscountValue}`}</p>
                                                    )}
                                                    {entry.itemDiscountType === 'Percentage' && (
                                                        <p>{`% ${entry.itemDiscountValue}`}</p>
                                                    )}
                                                    <p>{entry.itemDiscountDescription}</p>
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
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
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