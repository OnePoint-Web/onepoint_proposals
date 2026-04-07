'use client'
import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container.js'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout.js'
import PackageCard from './components/PackageCard'
import {useEffect, useState} from 'react'



export default function Packages(){

    const [packages, setPackages] = useState([])

    useEffect(() => {
        fetch('/api/packages')
        .then(res => res.json())
        .then(data => {
            const allPackages = data.map(packageItem => ({
                id: packageItem.packageId,
                title: packageItem.package,
                description: packageItem.description,
                solution: packageItem.proposedSolution,
                price: packageItem.basePrice
            }))
            setPackages(allPackages)
        })
    }, [])

    return(
        <ChildLayout>
            
            <Container>
                <div className={styles['packages-items']}>
                    {packages.map(pkg => (
                        <PackageCard
                            id={pkg.id}
                            key={pkg.id}
                            title={pkg.title}
                            price={pkg.price}
                            description={pkg.description}
                        />
                    ))}
                    
                </div>
                
            </Container>
        </ChildLayout>
    )
}