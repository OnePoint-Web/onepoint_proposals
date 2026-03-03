import styles from './Form.module.scss'

export default function Form({children, header, description, onSubmit}){
    return(
        <form className={styles.form} onSubmit={onSubmit}>
            {header && 
            <>
                <h3>{header}</h3>
                <p>{description}</p>

                <hr></hr>
            </>
            }
            
            {children}
        </form>
    )
}

export function FormInputContainer({children, label}) {
    return(
         <div className={`${styles['input-container']}`}>
                <div className={styles['container-child']}>
                    <p>{label}:</p>
                </div>

                {children}
        </div>
    )
}