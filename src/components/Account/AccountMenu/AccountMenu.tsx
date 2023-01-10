import styles from './AccountMenu.module.css'
import Link from 'next/link';

const AccountMenu = () => {

    return (
        <div className={styles.accountMenu}>
            <div className={styles.accountMenuPosition}>
                <Link href='/account'>Profile</Link>
            </div>
            <div className={styles.accountMenuPosition}>
                <Link href='/account/address'>Address</Link>
            </div>
            <div className={styles.accountMenuPosition}>
                <Link href='/account/services'>Services</Link>
            </div>
            <div className={styles.accountMenuPosition}>
                <Link href='/account/friends'>Friends</Link>
            </div>
            <div className={styles.accountMenuPosition}>
                <Link href='/account/puppies'>Puppies</Link>
            </div>
            <div className={styles.accountMenuPosition}>
                <Link href='/account/jobs'>Jobs</Link>
            </div>
        </div>
    )
}

export default AccountMenu;
