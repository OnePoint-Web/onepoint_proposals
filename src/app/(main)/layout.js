import { Montserrat } from "next/font/google";
import "../globals.css";
import styles from "./layout.module.scss";
import Header from '../../components/layout/Header/Header.js'
import Sidebar from '../../components/layout/Sidebar/Sidebar.js'
import Breadcrumbs from '../../components/ui/breadcrumbs/Breadcrumbs.js'


export default function RootLayout({ children }) {
  
  return (
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
  );
}
