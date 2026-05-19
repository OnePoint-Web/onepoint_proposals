'use client'
import styles from './components.module.scss'
import {useMemo} from 'react'
import DOMPurify from 'isomorphic-dompurify'


export default function GoalsAndObjectives({proposal}){


    const goalsAndObjectives = useMemo(() => {
        return DOMPurify.sanitize(proposal.goalsAndObjectives ?? "");
    }, [proposal.goalsAndObjectives]);

    return(
        <div className={styles['section']}>
            <div className={styles['goals-body']}>
                <div className={styles['section-head']}>
                    <p className={styles['section-title']}>GOALS AND OBJECTIVES</p>
                    <hr></hr>
                </div>

                <div className={styles['html-container']} dangerouslySetInnerHTML={{__html: goalsAndObjectives}}></div>
            </div>
        </div>
    )
}