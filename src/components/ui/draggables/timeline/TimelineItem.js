'use client'
import styles from '../DraggablesItem.module.scss'
import {Icons} from '@/components/icons/icons.js'
import Input from '@/components/ui/input/Input.js'
import TimelineScopeItem  from './TimelineScopeItem'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DeleteIcon = Icons.delete

export default function TimelineItem({id, scopes, addScope, dispatch}){

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDeleteTimeline = (timelineId) => {
        console.log('clicked')
        dispatch({
            type: 'DELETE_TIMELINE',
            payload: { timelineId }
        })
    }

    return(
        <div className={styles['package-deal-container']}>

             <div className={styles['deals-child']}>
                <Input
                    label='Timeframe:'
                    name='timeframe'
                    type="text"
                    placeholder='Month date, time...'
                    onChange={(e) => {
                        dispatch({
                            type: 'UPDATE_TIMELINE',
                            payload: { timelineId: id, data: {timeframe: e.target.value} }
                            
                        })
                    }}
                />
                
                <Input
                    label='Assigned to:'
                    name='assigned_to'
                    type='select'
                    values={[
                            {id: 'Paragraph', name: 'Paragraph'}, 
                            {id: 'List', name: 'List'}
                        ]}
                    onChange={(e) => {
                        dispatch({
                            type: 'UPDATE_TIMELINE',
                            payload: { timelineId: id, data: {assigned_to: e.target.value} }
                            
                        })
                    }}
                />

                <Input
                    label='Project Progress (%):'
                    name="project_progress"
                    type='number'
                    onChange={(e) => {
                        dispatch({
                            type: 'UPDATE_TIMELINE',
                            payload: { timelineId: id, data: {progress: e.target.value} }
                            
                        })
                    }}
                />
                
            </div>

            <TimelineScopeItem
                scopes={scopes}
                timelineId={id}
                dispatch={dispatch}
            />

            <div className={styles['handlers']}>

                <div 
                    className={`${styles['handler-btn']} ${styles['delete']}`}
                    onClick={() => handleDeleteTimeline(id)}
                >   
                    <DeleteIcon className={styles.icon}></DeleteIcon>
                </div>

                <hr></hr>
                
                <div className={`${styles['handler-btn']} ${styles['drag']}`}>   

                </div>
            </div>


        </div>
    )
}
