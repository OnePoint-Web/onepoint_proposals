import styles from './layout.module.scss'
export default function LoginLayout({ children }) {
  return (
      <div className={styles['auth-layout']}>
        {children}
      </div>
    )
}