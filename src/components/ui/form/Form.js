import styles from './Form.module.scss'

export default function Form({children, header, description, onSubmit}){
    return(
        <form className={styles.form} onSubmit={onSubmit}>
            <h3>Create User</h3>
            <p>Create a brand new user account for OnePoint proposals</p>

            <hr></hr>
            
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