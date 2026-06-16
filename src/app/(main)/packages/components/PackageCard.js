import styles from './PackageCard.module.scss'
import Link from 'next/link';

export default function PackageCard({title, price, description, slug}){
    return(
        <div className={styles['package-card']}>
            <div className={styles['details']}>
                <h4>{title}</h4>
                <p className={styles.price}>$ {price}</p>
                <p className={styles.description}>{description}</p>
            </div>

            <div className={styles['buttons']}>
                <div className={styles['card-btn']}>
                    <Link href={`/packages/${slug}`}>
                        <p>View</p>
                    </Link>
                </div>

            </div>
            
        </div>
    )
}