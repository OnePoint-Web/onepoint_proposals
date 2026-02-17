import styles from './Button.module.scss'

export default function Button(
    {
        label,
        color, //dark, light, red, green
        border,
        size, // xxs, xs, sm, md, lg
        fit, //full, fixed (null)
        action,
    }
){
    return(
        <button className={`${styles['global-button']} ${styles[color]} ${styles[size]} ${styles[border]} ${styles[fit]}`}>
            {label}
        </button>
    )
}