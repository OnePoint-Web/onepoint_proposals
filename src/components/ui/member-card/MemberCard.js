import styles from './MemberCard.module.scss'

export default function MemberCard({name, image, role, description}){
    return(
        <div className={styles['member-card']}>
            <img src={image}/>

            <div className={styles['card-details']}>
                <p className={styles.name}>{name}</p>
                <hr className={styles.divider}></hr>
                <p className={styles.role}>{role}</p>
                <p className={styles.description}>{description}</p>
            </div>
            
        </div>
    )
}