import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
    const {data: session} = useSession();

    return (
        <div className={styles.headerContainer}>
            <div>
                Logo
            </div>
            <div>
                <Link href='/pets'>
                    <a>Pets</a>
                </Link>
                <Link href='/dog-lovers'>
                    <a>Pet-lovers</a>
                </Link>
                <Link href='/account'>
                    <a>Account</a>
                </Link>
            </div>
            <div>
                {session ? 
                <button onClick={()=>signOut()}>Log out</button> :
                <button onClick={()=>signIn()}>Log in</button>
                }
            </div>
        </div>
    );
}

export default Header;