import styles from './AddItemButton.module.scss'
import {Icons} from '@/components/icons/icons.js'

const AddIcon = Icons.plusButton

export default function AddItemButton({addItem}){
    return(
        <div className={styles['add-item-btn']} onClick={() => addItem()}>
            <p>ADD ITEM</p>
            <AddIcon></AddIcon>
        </div>
    )
}