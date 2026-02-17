"use client"
import styles from './Input.module.scss'


export default function Input({
    type = 'text', //text, email, number, etc. Special case with 'select', switches out component
    label,
    weight,
    name,
    placeholder,
    value, // optional
    width, // full, (leave blank for default size)
    size, /*sm, md, lg*/
    values,
}){

    return(
        <div 
            className={`${styles['input-container']} 
            ${styles[width]} 
            ${styles[size]}
        `}
            style={{"--font-weight": weight}}
        >

            <label htmlFor={name}>{label}</label>

            { type !== 'select' ? (
                <input 
                    type={type} 
                    name={name} 
                    id={name} 
                    placeholder={placeholder} 
                    value={value}>
                </input>
            ) 
                :
            (
                <select>
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
            )
            }
            
        </div>
    )
}