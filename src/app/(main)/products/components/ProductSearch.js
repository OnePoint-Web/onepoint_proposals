import styles from './ProductSearch.module.scss'
import Input from '@/components/ui/input/Input.js'
import Container from '@/components/layout/Container/Container.js'
import { Icons } from '@/components/icons/icons.js'
import { useRouter } from 'next/navigation'

export default function ProductSearch({query, setQuery}){
    const ProductsIcon = Icons.products
    const router = useRouter()

    return (
        <Container fit="fullwidth">
            <div className={styles['search-section']}>
                <Input
                    label='Search Products:'
                    name='product'
                    placeholder='Product name or description'
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
                    <button onClick={() => router.push('/products/create-product')}>
                        <ProductsIcon className={styles.icon}/> Create Product
                    </button>
                </div>
            </div>
        </Container>
    )
}
