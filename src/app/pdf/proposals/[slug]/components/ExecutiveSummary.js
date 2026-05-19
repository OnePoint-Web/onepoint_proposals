'use client'
import styles from './components.module.scss'
import {useMemo} from 'react'
import DOMPurify from 'isomorphic-dompurify'




export default function ExecutiveSummary({proposal}){


    const executiveSummary = useMemo(() => {
        return DOMPurify.sanitize(proposal.executiveSummary ?? "");
    }, [proposal.executiveSummary]);

    console.log(executiveSummary)


    return(
        <div className={styles['section']}>
            <div className={styles['exec-body']}>
                <div className={styles['section-head']}>
                    <p className={styles['section-title']}>EXECUTIVE SUMMARY</p>
                    <hr></hr>
                </div>

                <div className={styles['html-container']} dangerouslySetInnerHTML={{__html: executiveSummary}}></div>
            </div>
        </div>
    )
}