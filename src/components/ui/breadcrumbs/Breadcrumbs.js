"use client"

import { usePathname } from 'next/navigation'
import styles from './Breadcrumbs.module.scss'
import {Icons} from '../../icons/icons.js'

export default function Breadcrumbs(){

    const ArrowIcon = Icons.rightArrow

    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);
    const parentPath = pathSegments.length !== 0 ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1) : "Dashboard"
    const childPaths = pathSegments.slice(1)

    return (
        <div className={styles['breadcrumbs-container']}>
             <h2 className={styles['header-text']}>{ parentPath}</h2>

             {childPaths.map((path, i) => (
                <p key={i} className={styles['path-text']}> <ArrowIcon/> {path.replace(/-/g, " ")}</p>
             ))}
             
        </div>
    )
}