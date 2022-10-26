import React from 'react';
import Button from '../Button/Button';
import { Provider } from "next-auth/providers"
import { signIn, SignInOptions } from "next-auth/react"
import styles from './LoginBox.module.css';
import logo from "@/src/assets/dog_logo.svg";
import Image from "next/image";

interface LoginBoxProps {
    providers: Provider[]
}

// TODO - fix callback url, use callbackUrl from query parameter
const LoginBox = ({providers}: LoginBoxProps) => {
    return (
        <>
            <div className={styles.loginBoxWraper}>
                <div>
                    <Image src={logo} alt="dog_logo"/>
                    <div className={styles.logoName}>
                        doggosy
                    </div>
                </div>
                <div className={styles.loginBoxButtons}>
                    {Object.values(providers).map((provider) => (
                        <div className={styles.loginButton}>
                            <Button size='large' fill='true' priority='mid' onClick={() => signIn(provider.id, { callbackUrl: '/pets' })}>
                                Sign in with {provider.name}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default LoginBox;