import { useSession } from "next-auth/react";
import styles from './Header.module.css';
import Image from "next/image";
import logo from "@/src/assets/dog_logo.svg";
import { FiMenu } from "react-icons/fi";
import { useState, useEffect } from "react";
import Menu from "../Menu/Menu";

const Header = () => {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [bodyStyle, setBodyStyle] = useState({});
    
    useEffect(() => {
        Object.entries(bodyStyle).forEach((item) => {
            document.body.style[item[0]] = item[1];
        });
    }, [bodyStyle]);
    
    function mobileMenuSwitch() {
    setOpen(!open);
    setBodyStyle(!open ? { overflow: 'hidden' } : { overflow: 'auto' });
    }

    return (
        <div className={open ? styles.headerContainerActive : styles.headerContainer}>
            {open ?
            <>
                <div className={styles.logoAndMobileMenuContainerActive}>
                    <div className={styles.logoContainer}>
                        <Image src={logo} alt="doggosy_logo"/>
                    </div>
                    <div className={styles.mobileMenuContainer}>
                        <FiMenu 
                            className={styles.mobileMenuButtonActive}
                            onClick={() => mobileMenuSwitch()}
                        />
                    </div>
                </div>
            </> :
            <>
                <div className={styles.logoContainer}>
                    <Image src={logo} alt="doggosy_logo"/>
                </div>
                <div>
                    <FiMenu 
                        className={styles.mobileMenuButton}
                        onClick={() => mobileMenuSwitch()}
                    />
                </div>
            </>}
            <Menu open={open} setOpen={setOpen}/>
        </div>
    );
}

export default Header;
