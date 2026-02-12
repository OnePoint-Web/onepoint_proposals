import styles from './Header.module.scss';


const Header = () => {
    return(
        <div className={styles.header}>
            <div></div>
            <div className={styles['user-container']}>
                <div className={styles['icon-container']}>
                    
                </div>

            </div>
            
        </div>
    )
}

export default Header;