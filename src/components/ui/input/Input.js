"use client"
import styles from './Input.module.scss'
import {Icons} from '@/components/icons/icons.js'

export default function Input({
    type = 'text', //text, email, number, etc. Special case with 'select', switches out component
    label,
    name,
    hideLabel=false,
    weight,
    placeholder,

    value, // optional
    width, // full, (leave blank for default size), medium
    size, /*sm, md, lg*/

    // values if form type = select
    values =[''],

    //react-hook-form
    rules,
    error,
    errorMessage
}){

    const ErrorIcon = Icons.error;

    return(
        <div 
            className={`${styles['input-container']} 
            ${styles[width]} 
            ${styles[size]}
        `}
            style={{"--font-weight": weight}}
        >

            <label htmlFor={name} className={hideLabel && styles['sr-only']}>{label}</label>

            { type !== 'select' ? (
                <div className={styles['input-wrapper']}>
                    <input 
                    className={styles[error]}
                        type={type} 
                        name={name} 
                        id={name} 
                        placeholder={placeholder} 
                        {...rules}
                        >
                    </input>

                    {error && 

                    <>
                        <ErrorIcon className={styles.icon}/>
                        <div className={styles['error-message']}>
                            <p>{errorMessage}</p>
                        </div>
                    </>
                    }
                        
                </div>

                
            ) 
                :
            (
                <div className={styles['input-wrapper']}>
                    <select
                    className={styles[error]}
                    {...rules}
                    >
                        {values.map((value, i) => {
                            return (
                                <option 
                                key={i} 
                                name={name}
                                id={name}
                                value={value}>
                                    {value}
                                </option>
                            )}) 
                        }
                    </select>

                    {error && 

                    <>
                        <ErrorIcon className={styles.icon}/>
                        <div className={styles['error-message']}>
                            <p>{errorMessage}</p>
                        </div>
                    </>
                    }
                </div>
            )
            }
            
        </div>
    )
}