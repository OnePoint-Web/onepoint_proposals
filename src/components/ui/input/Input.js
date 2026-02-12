"use client"
import styles from './Input.module.scss'


export default function Input({
    label,
    weight,
    name,
    placeholder,
    value, // optional
    width, // full, (leave blank for default size)
    size /*sm, md, lg*/
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
            <input name={name} id={name} placeholder={placeholder} value={value}/>
        </div>
    )
}