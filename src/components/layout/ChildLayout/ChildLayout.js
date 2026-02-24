import styles from './ChildLayout.module.scss'


export default function ChildLayout({children}){
    return (
         <div className={styles['page-layout']}>
            {children}
         </div>
    )
}