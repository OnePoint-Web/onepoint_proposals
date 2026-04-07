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
    disabled = false,

    value, // optional
    width, // small, full, (leave blank for default size), medium
    size, /*sm, md, lg*/

    // values if form type = select
    defaultValue,
    values, //format: {{id: '', name: ''}}

    min = 0, // minimum amount for number input
    max,

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
                        {...(value !== undefined
                            ? { value }       // controlled input
                            : { defaultValue: defaultValue || '' } // uncontrolled input
                        )}
                        type={type} 
                        name={name} 
                        disabled={disabled }
                        id={name} 
                        placeholder={placeholder} 
                        {...rules}
                        onChange={onChange}
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
                    disabled={disabled  }
                    min={min}
                    rules={rules}
                    value={value}
                    defaultValue={defaultValue}
                    max={max}
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
                        disabled={disabled}
                        {...(value !== undefined ? { value } : {})}
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


const NumberInput = ({name, error, defaultValue, errorMessage, rules, onChange, min, max, disabled, value}) => {
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

    const handleIncrement = () => {
    let newValue = getCurrentValue() + 1

    if (max !== undefined) {
        newValue = Math.min(newValue, max)
    }

    emitChange(newValue)
    }

    const handleDecrement = () => {
    let newValue = getCurrentValue() - 1

    if (min !== undefined) {
        newValue = Math.max(newValue, min)
    }

  emitChange(newValue)
}
  return (
    <div className={styles['input-wrapper']}>
      <input
        ref={inputRef}
        className={styles[error]}
        type="number"
        name={name}
        min={min}
        disabled={disabled}
        max={max}
        {...(value !== undefined
            ? { value }       // controlled input
            : { defaultValue: min ?? 0 } // uncontrolled input
        )}
        {...rules}
        onChange={(e) => {
            let val = Number(e.target.value)

            if (!isNaN(val)) {
                if (min !== undefined) val = Math.max(val, min)
                if (max !== undefined) val = Math.min(val, max)
            }

            const event = { target: { name, value: val } }

            if (rhfOnChange) rhfOnChange(event)
            if (onChange) onChange(event)

            if (inputRef.current) inputRef.current.value = val
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