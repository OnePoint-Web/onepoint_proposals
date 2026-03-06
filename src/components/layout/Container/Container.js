import styles from './Container.module.scss'

export default function Container({
    children, 
    fit = "full" //full, fit, fullwidth
}){
    return(
        <div className={`${styles.container} ${styles[fit]}`}>
            {children}
        </div>
    )
}