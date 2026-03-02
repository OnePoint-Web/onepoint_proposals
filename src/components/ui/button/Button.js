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
        disabled
    }
){

    const Icon = icon;

    return(
        <button disabled={disabled} type={action} className={`${styles['global-button']} ${styles[color]} ${styles[size]} ${styles[border]} ${styles[fit]}`}>
            {icon && (<Icon className={styles['btn-icon']}/>)} {label}
        </button>
    )
}