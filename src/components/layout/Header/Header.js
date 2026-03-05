import styles from './Header.module.scss';
import HeaderProfile from './HeaderProfile/HeaderProfile.js'

const Header = () => {
    return(
        <div className={styles.header}>
            <div></div>

            <HeaderProfile/>
            
        </div>
    )
}

export default Header;