'use client'
import styles from './TableList.module.scss';

export default function TableList({
    fields, //{fieldName, key, span}
    data
}){
    console.log(data)
    return(
        <div className={styles['table-container']}>
            <table>
                <tbody>
                    <tr>
                        <th>#</th>
                        {fields.map((field, i) => (
                            <th key={field.key} style={{width: field.span}}>{field.fieldName}</th>
                        ))}
                    </tr>
                    
                    {data && data.map((row, i) => {
                        return <tr key={i}>
                            <td>{i+1}</td>
                            {fields.map((field) => {
                                return <td key={field.key}>{row[field.key]}</td>
                            })}
                        </tr>
                    })}
    
                </tbody>
            </table>

            {(!data || data.length === 0) && <p className={styles['no-record']}>No Records Found</p>}
        </div>
    )
}