'use client'
import styles from './EmailsInputBar.module.scss'
import {useState} from 'react'

export default function EmailsInputBar(){

  const [input, setInput] = useState("");
  const [tags, setTags] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "," && input.trim()) {
      e.preventDefault();

      setTags([...tags, input.trim()]);
      setInput("");
    }

    if (e.key === "Backspace" && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

    return(
        <div className={styles.container}>
            {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                {tag}
                </span>
            ))}

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.input}
                placeholder="Separate emails with a coma..."
            />
        </div>      
    )
}
