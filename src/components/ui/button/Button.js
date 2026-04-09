'use client'

import styles from './Button.module.scss'

export default function Button(
    {
        label,
        color, //dark, light, red, green
        border,
        size, // xxs, xs, sm, md, lg
        fit, //full, fixed (null)
        icon,
        action,
        disabled,
        onClick
    }
){

    const Icon = icon;

    const onClickAction = (e) => {
        if (action !== 'submit') {
            e.preventDefault()
        }

        onClick?.(e)
    }

    return(
        <button 
        disabled={disabled} 
        type={action} 
        onClick={onClickAction}
        className={`${styles['global-button']} ${styles[color]} ${styles[size]} ${styles[border]} ${styles[fit]}`}>
            {icon && (<Icon className={styles['btn-icon']}/>)} {label}
        </button>
    )
}