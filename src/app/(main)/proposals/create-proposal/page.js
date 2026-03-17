'use client'

import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import CreateProposalHead from './components/CreateProposalHead'
import Input from '@/components/ui/input/Input'
import Checkbox from '@/components/ui/checkbox/Checkbox'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.js'
import CreateSLAPackage from './CreateSLAPackage.js'

import {useState, useReducer, useEffect} from 'react'
import {arrayMove} from '@dnd-kit/sortable';

const initialDeals = [
    {
        id: crypto.randomUUID(),
        item: '',
        item_type: '',
        display_order: 1,
        items: [
        {
            id: crypto.randomUUID(),
            entry: '',
            order: 1
        }
        ]
    }
]


const recalcOrder = (list, field) =>
  list.map((item, index) => ({
    ...item,
    [field]: index + 1
  }))

const dealsReducer = (state, action) => {
  switch (action.type) {

    case 'ADD_DEAL':
      return [
        ...state,
        {
          id: crypto.randomUUID(),
          item: '',
          item_type: '',
          display_order: state.length + 1,
          items: [{ id: crypto.randomUUID(), entry: '', order: 1 }]
        }
      ]

    case 'REORDER_DEALS': {
      const oldIndex = state.findIndex(d => d.id === action.payload.activeId)
      const newIndex = state.findIndex(d => d.id === action.payload.overId)
      const reordered = arrayMove(state, oldIndex, newIndex)
      return recalcOrder(reordered, "display_order")
    }

    case 'UPDATE_DEAL':
      return state.map(deal =>
        deal.id === action.payload.dealId
          ? { ...deal, ...action.payload.data }
          : deal
      )

    case 'ADD_ITEM':
      return state.map(deal =>
        deal.id === action.payload.dealId
          ? {
              ...deal,
              items: [
                ...deal.items,
                { id: crypto.randomUUID(), entry: '', order: deal.items.length + 1 }
              ]
            }
          : deal
      )

    case 'UPDATE_ITEM':
      return state.map(deal =>
        deal.id === action.payload.dealId
          ? {
              ...deal,
              items: deal.items.map(item =>
                item.id === action.payload.itemId
                  ? { ...item, ...action.payload.data }
                  : item
              )
            }
          : deal
      )

    case 'REORDER_ITEMS': {
      const { dealId, activeId, overId } = action.payload
      return state.map(deal => {
        if (deal.id !== dealId) return deal

        const oldIndex = deal.items.findIndex(i => i.id === activeId)
        const newIndex = deal.items.findIndex(i => i.id === overId)
        const reorderedItems = arrayMove(deal.items, oldIndex, newIndex)

        return {
          ...deal,
          items: recalcOrder(reorderedItems, "order")
        }
      })
    }

    case 'DELETE_DEAL':
        return state.filter(deal => deal.id !== action.payload.dealId)

    case 'DELETE_ITEM':
    return state.map(deal =>
        deal.id === action.payload.dealId
        ? { ...deal, items: deal.items.filter(item => item.id !== action.payload.itemId) }
        : deal
    )

    default:
      return state
  }
}
    


export default function CreateProposal(){

    const [proposalType, setProposalType] = useState('SLA Package')
    const [clientType, setClientType] = useState('Taxable')

    const [deals, dispatch] = useReducer(dealsReducer, initialDeals)

    return(
        <ChildLayout>
            <CreateProposalHead 
            setProposalType={setProposalType}
            serClientType={setClientType}
            />

            <Container>

                <CreateSLAPackage
                        deals={deals}
                        dispatch={dispatch}
                    />

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

                    {/* <p>Executive Summary</p>

                        <RichTextEditor/>

                    <hr></hr>

                    <p>Goals and Objectives</p>

                        <RichTextEditor/>
                        
                    <hr></hr>

                    <p>Proposed Solution</p>
                        <RichTextEditor/>

                    <hr></hr> */}

                    <p>Package Deals and Inclusions</p>

                    
                    
                        

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