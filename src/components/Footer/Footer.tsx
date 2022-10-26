import styles from "./Footer.module.css"
import Image from "next/image"
import logo from "@/src/assets/dog_logo.svg";

const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.logoContainer}>
                <div className={styles.logo}><Image src={logo} /></div>
                <strong>Doggosy</strong>
            </div>
            <div>
                <p className={styles.copyrightContainer}>Copyright © 2022 Doggosy. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
