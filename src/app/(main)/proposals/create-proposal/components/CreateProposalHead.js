import Container from '@/components/layout/Container/Container'
import Input from '@/components/ui/input/Input'
import styles from './CreateProposalHead.module.scss'
export default function CreateProposalHead({children}){
    return(
        <Container fit='fullwidth'>
            <div className={styles['proposal-head']}>
                <h3>Proposal Title:</h3>
                
                <Input width='full'
                    placeholder='Enter Proposal title here..'
                />
            </div>

            <hr></hr>

            <div className={styles['head-container']}>
                    <Input
                        label='Select Client:'
                    />
                     <Input
                        label='Client Type:'
                    />
                     <Input
                        label='Select Proposal Type:'
                    />
            </div>
            
        </Container>
    )
}