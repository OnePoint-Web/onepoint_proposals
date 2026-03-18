import styles from './Checkbox.module.scss'

export default function Checkbox({ label, value, name, checked, onChange }) {
  return (
    <div className={styles['checkbox-container']}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          value={value}
          name={name}
          checked={checked}
          onChange={onChange}
        />
        <span className={styles.customCheckbox}></span>
        {label}
      </label>
    </div>
  )
}