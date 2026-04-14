'use client'
import ChildLayout from "@/components/layout/ChildLayout/ChildLayout";
import Container from "@/components/layout/Container/Container.js"
import Button from '@/components/ui/button/Button'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'
import {useState} from 'react'
import {Icons} from '@/components/icons/icons'
import DOMPurify from 'dompurify'

export default function PackagePage({packageData, slug}){
    const router = useRouter()
    const ErrorIcon = Icons.error
    const [toggleModal, setToggleModal] = useState(false)

    const proposedSolution = useMemo(() => {
        return DOMPurify.sanitize(packageData.proposedSolution ?? "");
    }, [packageData.proposedSolution]);

      const handleDelete = async () => {
        const res = await fetch(`/api/packages/${slug}`, { method: 'DELETE' })
        if (!res.ok) {
          console.error('Failed to delete')
          return
        }
        const data = await res.json()
        
        router.push('/packages') 
        console.log(data)

        alert('Package deleted!')
      }

    const inclusions = packageData.dealItems
    return (
        <ChildLayout>
            <Container>
                

                <div className={styles['package-container']}>
                  <p  className={styles['header']}>Service Level Agreement</p>   

                  <h1>{packageData.package}</h1> 

                 

                  <p className={styles['price']}> $ {packageData.basePrice.toString()} <span>(tax not included)</span></p>     

                   <hr></hr>

                  <p className={styles['header']}>Overview:</p>
              
                  <p>{packageData.description}</p>

                  <hr></hr>

                  <p className={styles['header']}>Proposed Solution:</p>
                  <div className={`${styles['proposal-solution-container']} ${styles['rich-text']}`} dangerouslySetInnerHTML={{__html: proposedSolution}}></div>   
                
                  <p className={styles['header']}>Inclusions:</p>


                  <div className={styles['inclusions-container']}>


                    {inclusions.map((item, index) => {
                      return item.itemType === 'Paragraph' ? (
                        <div key={item.dealItemId} className={`${styles['deal-container']} ${styles['paragraph']}`}>
                          <p className={styles['item-header']}>{item.dealItem}</p>
                          <p>{item.dealEntries[0].itemEntry}</p>
                        </div>
                      ) : (
                         <div key={item.dealItemId} className={`${styles['deal-container']}`}>
                          <p className={styles['item-header']}>{item.dealItem}</p>
                          <ul>
                            {item.dealEntries.map(entries => (
                              <li key={entries.itemEntryId}>{entries.itemEntry}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}

                  </div>


                </div>

                <div className={`${styles['btn-container']}`}>
                  <Button
                      label='Edit'
                      size='xxs'
                    />

                    <Button
                      label='Delete'
                      size='xss'
                      color='red'
                      onClick={() => setToggleModal(true)}
                    />

                </div>


              {toggleModal && (
                <div 
                  className={`${styles['modal-bg']}`} 
                  onClick={() => setToggleModal(false)}
                >  

                  <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
                      

                    <p className={styles.head}> <ErrorIcon className={styles.icon}/> Delete Package</p>
                    <p className={styles.body}> Are you sure you want to delete <span>{packageData.package}?</span></p>
                    

                    <div className={styles['delete-btns']}>

                      <Button
                        label='Cancel'
                        size='xss'
                        color='dark'
                        onClick={() => setToggleModal(false)}
                      />

                      <Button
                        label='Confirm'
                        size='xss'
                        color='red'
                        onClick={() => handleDelete()}
                      />
                    </div>
                  </div>              
              
                </div>  
              )}


              

            </Container>

            
        </ChildLayout>
     )
}