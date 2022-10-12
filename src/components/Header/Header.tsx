import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import styles from './Header.module.css';
import Image from "next/image";
import logo from "@/src/assets/dog_logo.svg";
import Button from "@/src/components/Button/Button";

const Header = () => {
    const {data: session} = useSession();

    return (
        <div className={styles.headerContainer}>
            <div className={styles.logoContainer}>
                <Image src={logo} alt="dog_logo"/>
            </div>
            <div className={styles.navContainer}>
                <Link href='/account'>
                    <a className={styles.menuContainer}>Home</a>
                </Link>
                <Link href='/pets'>
                    <a className={styles.menuContainer}>Dogs</a>
                </Link>
                <Link href='/account'>
                    <a className={styles.menuContainer}>Dog-lovers</a>
                </Link>
            </div>
            <div className="flex">

                {session ?
                <Button
                    onClick={()=>signOut()}
                    priority="low"
                >Log Out</Button> :
                <Button
                    onClick={()=>signIn()}
                    priority="low"
                >Log In</Button>
                }
            </div>
        </div>
    );
}

export default Header;
