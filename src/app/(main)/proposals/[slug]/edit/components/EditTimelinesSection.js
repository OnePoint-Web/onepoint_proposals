import styles from './components.module.scss'
import TimelineItem from '@/components/ui/draggables/timeline/TimelineItem'
import AddItemButton from '@/components/ui/draggables/add-item-button/AddItemButton.js'

export default function EditTimelineSection({timelines, dispatch, errors}){

    const addTimeline = () => {
        dispatch({ type: 'ADD_TIMELINE' })
    }

     const addScope = (timelineId) => {
        dispatch({
            type: 'ADD_SCOPE',
            payload: { timelineId }
        })
    }
    return(
        <div className={styles['child-container']}>
                        

                    {timelines.map(item => (
                        <TimelineItem 
                           key={item.timelineId} 
                            id={item.timelineId}
                            errors={errors}
                            timeline={item}
                            scopes={item.timelineScopeItems}
                            addScope={() => addScope(item.timelineId)}
                            dispatch={dispatch}
                        />
                    ))}
                

            <AddItemButton addItem={addTimeline}/>
        </div>
    )
}