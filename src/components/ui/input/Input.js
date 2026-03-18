"use client"
import styles from './Input.module.scss'
import {Icons} from '@/components/icons/icons.js'
import {useState} from 'react'

const ErrorIcon = Icons.error;
const EyeOpen = Icons.passwordEyeOpen
const EyeClose = Icons.passwordEyeClosed

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
    values, //format: {{id: '', name: ''}}

    //react-hook-form
    rules,
    error,
    errorMessage,
    onChange = null

}){

    const [showPassword, setShowPassword] = useState(false)

    return(
        <div 
            className={`${styles['input-container']} 
            ${styles[width]} 
            ${styles[size]}
        `}
            style={{"--font-weight": weight}}
        >

           <label htmlFor={name} className={hideLabel ? styles['sr-only'] :''}>{label}</label>

            { type !== 'select' ? type === 'password' ? (
                <div className={styles['password-container']}>
                    <PasswordInput
                        name={name}
                        error={error}
                        placeholder={placeholder}
                        errorMessage={errorMessage}
                        showPassword={showPassword}
                        rules={rules}
                    />
                    <button type='button' onClick={() => setShowPassword(prev => !prev)} className={styles['password-toggle']}>{showPassword ? <EyeOpen/> : <EyeClose/>}</button>
                </div>
                    
            ) : type === 'textarea' ? (

                <div className={`${styles['input-wrapper']}`}>
                    <textarea 
                    className={styles[error]}
                        type={type} 
                        name={name} 
                        id={name} 
                        placeholder={placeholder} 
                        {...rules}
                    />

                    {error && 
                        <>
                            <ErrorIcon className={styles.icon}/>
                            <div className={styles['error-message']}>
                                <p>{errorMessage}</p>
                            </div>
                        </>
                    }
                        
                </div>

            ) : (
                
                <div className={styles['input-wrapper']}>
                    <input 
                    className={styles[error]}
                        type={type} 
                        name={name} 
                        id={name} 
                        placeholder={placeholder} 
                        {...rules}
                    />

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
                <SelectInput
                    name={name}
                    error={error}
                    errorMessage={errorMessage}
                    placeholder={placeholder}
                    values={values}
                    rules={rules}
                    onChange={onChange}
                />
            )
            }
            
        </div>
    )
}

const PasswordInput = ({name, error, placeholder, errorMessage, showPassword, rules}) => {
    return(
        
        <div className={styles['input-wrapper']}>
            <input 
            className={styles[error]}
                type={showPassword ? 'text' : 'password'} 
                name={name} 
                id={name} 
                placeholder={placeholder} 
                {...rules}
            />

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


const SelectInput = ({name, values, placeholder, error, errorMessage, rules, onChange}) => {
    return (
    <div className={styles['input-wrapper']}>
        <select
        className={styles[error]}
        name={name}
        id={name}
        onChange={onChange}
        {...rules}
        >
            {values.map((value, i) => {
                return (
                    <option 
                    key={i} 
                    value={value.id}>
                        {value.name}
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