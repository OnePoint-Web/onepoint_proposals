import styles from '../page.module.scss'
import TimelineItem from '@/components/ui/draggables/timeline/TimelineItem'
import AddItemButton from '@/components/ui/draggables/add-item-button/AddItemButton.js'

export default function TimelineSection({timelines, dispatch, errors}){

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
                           key={item.id} 
                            id={item.id}
                            errors={errors}
                            scopes={item.scopes}
                            addScope={() => addScope(item.id)}
                            dispatch={dispatch}
                        />
                    ))}
                

            <AddItemButton addItem={addTimeline}/>
        </div>
    )
}