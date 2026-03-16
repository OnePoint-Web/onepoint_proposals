'use client'

// Tiptap imports
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'


import styles from './RichTextEditor.module.scss'
import MenuBar from './menu-bar/MenuBar.js'


export default function Tiptap(){
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Hello World! 🌎️</p>',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: styles['rich-text-editor']
            }
        }
    })

    return(
        <div className={styles['editor-container']}>
            <MenuBar editor={editor}/>
            <EditorContent editor={editor}/>
        </div>
    ) 
}
