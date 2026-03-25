"use client"
import styles from './Input.module.scss'
import {Icons} from '@/components/icons/icons.js'
import {useState, useRef} from 'react'

const ErrorIcon = Icons.error;
const EyeOpen = Icons.passwordEyeOpen
const EyeClose = Icons.passwordEyeClosed
const ArrowDropDown = Icons.arrowDropDown
const ArrowDropUp = Icons.arrowDropUp

export default function Input({
    type = 'text', //text, email, number, etc. Special case with 'select', switches out component
    label,
    name,
    hideLabel=false,
    weight,
    placeholder,

    value, // optional
    width, // small, full, (leave blank for default size), medium
    size, /*sm, md, lg*/

    // values if form type = select
    values, //format: {{id: '', name: ''}}

    min = 0, // minimum amount for number input

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

            ) : type === 'number' ? (
                <NumberInput
                    name={name}
                    error={error}
                    placeholder={placeholder}
                    errorMessage={errorMessage}
                    min={min}
                    rules={rules}
                    onChange={onChange}
                />
            ) : (
                
                <div className={styles['input-wrapper']}>
                    <input 
                    className={styles[error]}
                        type={type} 
                        name={name} 
                        id={name} 
                        placeholder={placeholder} 
                        onChange={onChange}
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


const NumberInput = ({name, error, value, errorMessage, rules, onChange, min}) => {
  const inputRef = useRef(null)
  const rhfOnChange = rules?.onChange

  // Emit a change event to parent and RHF if needed
  const emitChange = (newValue) => {
    const event = { target: { name, value: newValue } }

    // Trigger RHF onChange if provided
    if (rhfOnChange) rhfOnChange(event)

    // Trigger parent onChange
    if (onChange) onChange(event)

    // Update input DOM value
    if (inputRef.current) inputRef.current.value = newValue
  }

  const getCurrentValue = () => {
    const val = Number(inputRef.current?.value)
    return isNaN(val) ? min : val
  }

  const handleIncrement = () => emitChange(getCurrentValue() + 1)
  const handleDecrement = () => emitChange(Math.max(min, getCurrentValue() - 1))

  return (
    <div className={styles['input-wrapper']}>
      <input
        ref={inputRef}
        className={styles[error]}
        type="number"
        name={name}
        min={min}
        defaultValue={min} // start at min if not set
        {...rules}
        onChange={(e) => {
          if (rhfOnChange) rhfOnChange(e)
          if (onChange) onChange(e)
        }}
      />

      <div className={styles['number-control']}>
        <div className={styles['number-btn-container']} onClick={handleIncrement}>
          <ArrowDropUp className={styles['number-control-icon']} />
        </div>
        <hr />
        <div className={styles['number-btn-container']} onClick={handleDecrement}>
          <ArrowDropDown className={styles['number-control-icon']} />
        </div>
      </div>

      {error && (
        <>
          <ErrorIcon className={styles.icon} />
          <div className={styles['error-message']}>
            <p>{errorMessage}</p>
          </div>
        </>
      )}
    </div>
  )
}