'use client'
import styles from './MemberCard.module.scss'
import {Icons} from '@/components/icons/icons'

const DeleteIcon = Icons.delete

export default function MemberCard({name, image, role, description, onClick, onDelete}){
    

    return(
        <div className={styles['member-card']} onClick={onClick}>
            {image
                ? <img src={image} alt={name} />
                : <div className={styles['img-placeholder']} />
            }

            {onDelete && (
                <div className={styles['buttons-container']}>

                    <div className={styles['delete-btn']} onClick={onDelete}>
                        <DeleteIcon className={styles['icon']}/>
                    </div>

                </div>
            )}

            <div className={styles['card-details']}>
                <p className={styles.name}>{name}</p>
                <hr className={styles.divider}></hr>
                <p className={styles.role}>{role}</p>
                <p className={styles.description}>{description}</p>
            </div>
            
        </div>
    )
}