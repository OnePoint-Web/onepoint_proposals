'use client'

// Tiptap imports
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import styles from './RichTextEditor.module.scss'
import MenuBar from './menu-bar/MenuBar.js'

import { useEffect, useRef } from 'react'

export default function Tiptap({ onChange, value }) {
    const lastValueRef = useRef('')

    const editor = useEditor({
        extensions: [StarterKit],
        content: value || '',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: styles['rich-text-editor']
            }
        },
        onUpdate({ editor }) {
            const html = editor.getHTML()

            if (html !== lastValueRef.current) {
                lastValueRef.current = html
                onChange?.(html)
            }
        }
    })

    useEffect(() => {
        if (!editor) return

        if (value === lastValueRef.current) return

        lastValueRef.current = value || ''
        editor.commands.setContent(value || '', false)
    }, [value, editor])

    return (
        <div className={styles['editor-container']}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}