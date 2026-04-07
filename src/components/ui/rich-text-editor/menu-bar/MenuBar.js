 import styles from './MenuBar.module.scss'
import {Icons} from '@/components/icons/icons.js'

const BoldIcon = Icons.boldIcon
const ItalicIcon = Icons.italicIcon
const UnderlineIcon = Icons.underlineIcon
const UnorderedList = Icons.unorderedList
const OrderedList = Icons.orderedList

export default function MenuBar({editor}){

    if(!editor){
        return null
    }

    return(
        <div className={styles['menubar-container']}>
            <button
            type='button'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${styles['editor-btns']} ${editor.isActive('bold') ? styles['is-active'] : ''}`}
            ><BoldIcon/></button>

            <button
            type='button'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${styles['editor-btns']} ${editor.isActive('bold') ? styles['is-active'] : ''}`}
            ><ItalicIcon/></button>

            <button
            type='button'
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${styles['editor-btns']} ${editor.isActive('bold') ? styles['is-active'] : ''}`}
            ><UnderlineIcon/></button>

            <button
            type='button'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${styles['editor-btns']} ${editor.isActive('bold') ? styles['is-active'] : ''}`}
            >LI</button>

            <button
            type='button'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles['editor-btns']} ${editor.isActive('bold') ? styles['is-active'] : ''}`}
            ><UnorderedList/></button>

             <button
            type='button'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles['editor-btns']} ${editor.isActive('bold') ? styles['is-active'] : ''}`}
            ><OrderedList/></button>
        </div>
    )
}