import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import CreateProposalHead from './components/CreateProposalHead'
import Input from '@/components/ui/input/Input'


export default function CreateProposal(){
    return(
        <ChildLayout>
            <CreateProposalHead>
            </CreateProposalHead>

            <Container>
                <div className={styles['create-proposal-body']}>
                    <h3>
                        Partnership Program Proposal
                    </h3>

                    <hr></hr>

                    <div className={styles['proposal-body-child']}>


                        <div className={styles['child-container']}>
                            <p>Proposal Solution Package:</p>
                            <Input
                            label='Select Package' 
                            />
                        </div>

                    <hr></hr>

                        <div className={styles['child-container']}>
                            <p>Team (leave blank if not applicable)</p>

                            <div className={styles['team-selection-container']}> 


                            </div>
                            
                        </div>
                       
                    </div>

                    <hr></hr>

                    <p>Executive Summary</p>

                    <hr></hr>

                    <p>Goals and Objectives</p>

                    <hr></hr>

                    <p>Proposed Solution</p>

                    <hr></hr>

                    <p>Package Deals and Inclusions</p>

                    <hr></hr>

                    <p>Package Description</p>

                    <hr></hr>

                    <p>Timeline</p>

                    <hr></hr>

                    <p>Pricing and Tax</p>
                    
                    <hr></hr>

                    <p>Payment Terms</p>

                </div>
            </Container>

        </ChildLayout>
    )
}