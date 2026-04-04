import styles from './ComboBox.module.scss'
import {useState} from 'react'
import {Icons} from '@/components/icons/icons.js'

const ErrorIcon = Icons.error;

export default function ComboBox({
    options=[{id: '', name: 'john'},
        {id: '2', name: 'hlloe'}
    ], 
    name,
    placeholder, 
    label, 
    rules, 
    onSelect, 
    onChange, 
    error, 
    errorMessage, 
    dispatch, 
    hideLabel, 
    disabled, 
    value})
    {
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)

    const onInputChange = (value) => {
        setQuery(value);
    }

    const filtered = options.filter(opt => 
        opt.name.toLowerCase().includes(query.toLowerCase())
    )
    
    return(
        <div className={`${styles['input-container']}`}>
             <label htmlFor={name} className={hideLabel ? styles['sr-only'] :''}>{label}</label>

             <div className={styles['input-wrapper']}>
                <input 
                    className={styles[error]}
                    type='text'
                    name={name} 
                    id={name} 
                    value={query}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder} 
                    onChange={(e) => {
                        const value = e.target.value
                        onInputChange(value)
                        setOpen(true);
                    }
                    }   
                    {...rules}
                    disabled={disabled}
                />

                {error && 
                    <>
                        <ErrorIcon className={styles.icon}/>
                        <div className={styles['error-message']}>
                            <p>{errorMessage}</p>
                        </div>
                    </>
                }
                    {open && (
                        <ul className={styles['dropdown']}>
                        {filtered.map(item => (
                            <li
                            key={item.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                setQuery(item.name);
                                setOpen(false);
                                onSelect?.(item.id)
                            }}
                            >
                            {item.name}
                            </li>
                        ))}
                        </ul>
                    )}
            </div>
        </div>
    )
}