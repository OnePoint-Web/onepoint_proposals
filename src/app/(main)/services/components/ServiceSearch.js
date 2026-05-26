import styles from './ServiceSearch.module.scss'
import Input from '@/components/ui/input/Input.js'
import Container from '@/components/layout/Container/Container.js'
import { Icons } from '@/components/icons/icons.js'
import { useRouter } from 'next/navigation'

export default function ServiceSearch({query, setQuery}){
    const ServicesIcon = Icons.services
    const router = useRouter()

    return (
        <Container fit="fullwidth">
            <div className={styles['search-section']}>
                <Input
                    label='Search Services:'
                    name='service'
                    placeholder='Service name or description'
                    width='full'
                    value={query.search}
                    onChange={(e)=>{
                        setQuery(prev => ({
                            ...prev,
                            search: e.target.value,
                            page: 1
                        }))
                    }}
                />

                <div className={styles['button-container']}>
                    <label>____</label>
                    <button onClick={() => router.push('/services/create-service')}>
                        <ServicesIcon className={styles.icon}/> Create Services
                    </button>
                </div>
            </div>
        </Container>
    )
}
