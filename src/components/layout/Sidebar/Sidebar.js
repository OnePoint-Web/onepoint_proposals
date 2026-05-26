"use client"

import styles from './Sidebar.module.scss'
import {Icons} from '../../icons/icons.js'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const DashboardIcon = Icons.dashboard;
const ProposalsIcon = Icons.proposals
const PackagesIcon = Icons.packages;
const ProductsIcon = Icons.products
const ServicesIcon = Icons.services
const UsersIcon = Icons.users;
const ClientsIcon = Icons.clients
const TeamsIcon = Icons.teamIcon

export default function Sidebar(){

    const pathname = usePathname();

    return(
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            
          </div>

          <div className={styles['sidebar-container']}>
              <input className={styles['sidebar-search']} placeholder='Search tools'></input>

              <hr></hr>

              <nav className={styles['sidebar-items']}>

                <Link 
                    href='/dashboard' 
                    className={`${styles.item} ${pathname === '/dashboard' ? styles.active : ''}`} >
                    <DashboardIcon className={styles['icon']}/>
                    Dashboard
                </Link>

                <p className={styles['item-section']}> PROPOSALS </p>
                <hr></hr>

                <Link 
                    href='/proposals' 
                    className={styles['item']}>
                    <ProposalsIcon className={styles['icon']}/> 
                    Proposals
                </Link>

                    <Link href='/proposals' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/proposals' ? styles.active : ''}`}>
                        List Proposals
                    </Link>
                    <Link href='/proposals/create-proposal' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/proposals/create-proposal' ? styles.active : ''}`}>
                        Create Proposals
                    </Link>

                <Link 
                    href='/packages' 
                    className={styles['item']}>
                    <PackagesIcon className={styles['icon']}/> 
                    Packages
                </Link>

                    <Link href='/packages' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/packages' ? styles.active : ''}`}>
                        List Packages
                    </Link>

                    <Link href='/packages/create-package' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/packages/add-package' ? styles.active : ''}`}>
                        Add New Package
                    </Link>

                <Link 
                    href='/products' 
                    className={styles['item']}>
                    <ProductsIcon className={styles['icon']}/> 
                    Products
                </Link>

                    <Link href='/products' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/products' ? styles.active : ''}`}>
                        List Products
                    </Link>

                    <Link href='/products/add-product' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/products/add-product' ? styles.active : ''}`}>
                        Add New Product
                    </Link>

                <Link 
                    href='/services' 
                    className={styles['item']}>
                    <ServicesIcon className={styles['icon']}/> 
                    Services
                </Link>

                    <Link href='/services' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/services' ? styles.active : ''}`}>
                        List Services
                    </Link>

                    <Link href='/services/add-service' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/services/add-service' ? styles.active : ''}`}>
                        Add New Service
                    </Link>

                <Link 
                    href='/teams-and-members' 
                    className={styles['item']}>
                    <TeamsIcon className={styles['icon']}/> 
                    Teams and Members
                </Link>

                    <Link href='/teams-and-members' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/teams-and-members' ? styles.active : ''}`}>
                        List Teams
                    </Link>

                    <Link href='/teams-and-members/add-member' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/teams-and-members/add-member' ? styles.active : ''}`}>
                        Add Member
                    </Link>
                    
                <p className={styles['item-section']}> ACCOUNTS </p>
                <hr></hr>

                <Link 
                    href='/users' 
                    className={styles['item']}>
                    <UsersIcon className={styles['icon']}/> 
                    Users
                </Link>

                    <Link href='/users' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/users' ? styles.active : ''}`}>
                        List Users
                    </Link>

                    <Link href='/users/create-user' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/users/create-user' ? styles.active : ''}`}>
                        Create New User
                    </Link>

                <Link 
                    href='/clients' 
                    className={styles['item']}>
                    <ClientsIcon className={styles['icon']}/> 
                    Clients
                </Link>

                    <Link href='/clients' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/clients' ? styles.active : ''}`}>
                        List Clients
                    </Link>

                    <Link href='/clients/create-client' className={`${styles['item']} ${styles['sub-item']} ${pathname === '/clients/create-client' ? styles.active : ''}`}>
                        Create New Client
                    </Link>


              </nav>
          </div>
        </aside>
    )
}
