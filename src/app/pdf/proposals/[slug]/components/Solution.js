'use client'
import styles from './components.module.scss'
import {useMemo} from 'react'
import DOMPurify from 'isomorphic-dompurify'


export default function ProposedSolution({proposal}){


    const proposedSolution = useMemo(() => {
        return DOMPurify.sanitize(proposal.proposedSolution ?? "");
    }, [proposal.proposedSolution]);

    return(
        <div className={styles['section']}>
            <div className={styles['goals-body']}>
                <div className={styles['section-head']}>
                    <p className={styles['section-title']}>OUR SOLUTION</p>
                    <hr></hr>
                </div>

                <div className={styles['html-container']} dangerouslySetInnerHTML={{__html: proposedSolution}}></div>
            </div>
        </div>
    )
}