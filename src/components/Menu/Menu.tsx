import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import styles from './Menu.module.css';
import Button from "@/src/components/Button/Button";
import { useState, useEffect } from "react";

const Menu = (props:any) => {
    const {data: session} = useSession();
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
        setScreenWidth(window.innerWidth);
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
          if(screenWidth >= 640){
            document.body.style['overflow'] = 'auto';
            props.setOpen(false);
          } else if(screenWidth < 640 && props.open){
            document.body.style['overflow'] = 'hidden';
          } else if(screenWidth < 640 && !props.open){
            document.body.style['overflow'] = 'auto';
          }
        };
      }, [screenWidth]);

    return (
        <>
            {screenWidth >= 640 ? 
                <>
                    <div className={styles.navContainer}>
                        <Link href='/'>
                            <a className={styles.menuContainer}>Home</a>
                        </Link>
                        <Link href='/dogs'>
                            <a className={styles.menuContainer}>Dogs</a>
                        </Link>
                        <Link href='/jobs'>
                            <a className={styles.menuContainer}>Jobs</a>
                        </Link>
                    </div>
                    <div className={styles.accountAndLoginContainer}>
                        {session ?
                        <>
                            <div className={styles.accountContainer}>
                                <Link href='/account'>
                                    <a className={styles.menuContainer}>Account</a>
                                </Link>
                            </div>
                            <div className={styles.logOutButton}>
                                <Button
                                    onClick={()=>signOut()}
                                    priority="low"
                                >Log Out</Button> 
                            </div>
                        </> :
                        <div className={styles.logInButton}>
                            <Button
                                onClick={()=>signIn()}
                                priority="low"
                            >Log In</Button>
                        </div>
                        }
                    </div>
                </> :  
                <div className={props.open ? styles.navContainerActive : styles.navContainer}>
                    <Link href='/'>
                        <a className={styles.menuContainer}>Home</a>
                    </Link>
                    <Link href='/dogs'>
                        <a className={styles.menuContainer}>Dogs</a>
                    </Link>
                    <Link href='/jobs'>
                        <a className={styles.menuContainer}>Jobs</a>
                    </Link>
                    {session ?
                        <>
                            <Link href='/account'>
                                <a className={styles.menuContainer}>Account</a>
                            </Link>
                            <div className={styles.logButtonMobile}>
                                <Button
                                    onClick={()=>signOut()}
                                    priority="low"
                                >Log Out</Button> 
                            </div>
                        </> :
                        <div className={styles.logButtonMobile}>
                            <Button
                                onClick={()=>signIn()}
                                priority="low"
                            >Log In</Button>
                        </div>
                    }
                </div>   
            }
        </>
    );
}

export default Menu;
