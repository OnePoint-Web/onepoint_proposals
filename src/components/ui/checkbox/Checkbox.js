import styles from './Checkbox.module.scss'


export default function Checkbox({label, value, name}){
    return(
        <div className={styles['checkbox-container']}>
            <input type="checkbox" value={value && value}/>
            <label>{label}</label>
        </div>
    )
}