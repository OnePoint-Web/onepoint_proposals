import { Montserrat } from "next/font/google";
import "../globals.css";
import requireAuth from "@/lib/auth";
import { AuthProvider } from "@/context/AuthContext";

import styles from "./layout.module.scss";
import Header from '../../components/layout/Header/Header.js'
import Sidebar from '../../components/layout/Sidebar/Sidebar.js'
import Breadcrumbs from '../../components/ui/breadcrumbs/Breadcrumbs.js'



export default async function RootLayout({ children }) {

  const user = await requireAuth()

  return (
    <AuthProvider>
      <div className={`${styles['main-layout']}`}>
        <Sidebar/>

        <main className={styles['main-outlet']}>
          <Header/>
          
          <div className={styles['outlet-container']}>

            <Breadcrumbs/>

            <div className={styles.outlet}>
              {children} 
            </div>
            
          </div>
                      
        </main>
        
      </div>
    </AuthProvider>
        
  );
}
