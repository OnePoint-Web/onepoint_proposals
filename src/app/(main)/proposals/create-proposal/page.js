'use client'

import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import CreateProposalHead from './components/CreateProposalHead'
import Input from '@/components/ui/input/Input'
import Checkbox from '@/components/ui/checkbox/Checkbox'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.js'


import PackageDeal from '@/components/ui/draggables/package-deal/PackageDeal.js'
import AddItemButton from '@/components/ui/draggables/add-item-button/AddItemButton.js'

import {useState, useReducer} from 'react'

import {SortableContext, arrayMove} from '@dnd-kit/sortable';
import { DndContext } from '@dnd-kit/core'


export default function CreateProposal(){


    const [deals, setDeals] = useState([
        {
            id: crypto.randomUUID(),
            item: '',
            item_type: '',
            display_order: '',
            items: [{
                id: crypto.randomUUID(),
                entry: '',
                order: ''
            }]
        }
    ])

    const addItem = () => {
        const newItem = {
            id: crypto.randomUUID(),
            item: "",
            item_type: '',
            display_order: "",
            items: [{
                id: crypto.randomUUID(),
                entry: '',
                order: ''
            }]
        }
        setDeals(prev => [...prev, newItem])
    }

     const addListItem = (dealId) => {
        console.log('clicked')
        const newListItem = {
            id: crypto.randomUUID(),
            entry: '',
            order: ''
        }
        setDeals(prev =>
            prev.map(deal =>
                deal.id === dealId
                    ? { ...deal, items: [...deal.items, newListItem] }
                    : deal
            )
        )
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setDeals((prevDeals) => {
            const oldIndex = prevDeals.findIndex(deal => deal.id === active.id);
            const newIndex = prevDeals.findIndex(deal => deal.id === over.id);
            return arrayMove(prevDeals, oldIndex, newIndex);
            });
        }
    };


    return(
        <ChildLayout>
            <CreateProposalHead>
            </CreateProposalHead>

            <Container>
                <div className={styles['create-proposal-body']}>
                    <h3>
                        Partnership Program Proposal
                    </h3>

                    <hr></hr>

                    <div className={styles['proposal-body-child']}>

                        <div className={styles['child-container']}>
                            <p>Proposal Solution Package:</p>
                            <Input
                            label='Select Package' 
                            />
                        </div>

                    <hr></hr>

                        <div className={styles['child-container']}>
                            <p>Team (leave blank if not applicable)</p>

                            <div className={styles['team-selection-container']}> 
                                <Checkbox label='hellafasevsrbo'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                                <Checkbox label='hello'/>
                            </div>
                            
                        </div>
                       
                    </div>

                    <hr></hr>

                    <p>Executive Summary</p>

                        <RichTextEditor/>

                    <hr></hr>

                    <p>Goals and Objectives</p>

                        <RichTextEditor/>
                        
                    <hr></hr>

                    <p>Proposed Solution</p>
                        <RichTextEditor/>

                    <hr></hr>

                    <p>Package Deals and Inclusions</p>

                    <DndContext onDragEnd={handleDragEnd}>
                        <SortableContext items={deals.map(i => i.id)}>
                            {deals.map(item => (
                                <PackageDeal 
                                    key={item.id} 
                                    id={item.id}
                                    dealItems={item.items}
                                    addListItem={() => addListItem(item.id)}
                                    setDeals={setDeals}
                                />
                            ))}

                        </SortableContext>
                    </DndContext>
                        

                    <AddItemButton addItem={addItem}/>
                        

                    <hr></hr>

                    <p>Package Description</p>

                    <hr></hr>

                    <p>Timeline</p>

                    <hr></hr>

                    <p>Pricing and Tax</p>
                    
                    <hr></hr>

                    <p>Payment Terms</p>

                </div>
            </Container>

        </ChildLayout>
    )
}