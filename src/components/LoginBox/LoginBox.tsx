import React from 'react';
import Button from '../Button/Button';
import { Provider } from "next-auth/providers"
import { signIn, SignInOptions } from "next-auth/react"
import styles from './LoginBox.module.css';
import logo from "@/src/assets/dog_logo.svg";
import googleIcon from "@/src/assets/google-icon.svg";
import discordIcon from "@/src/assets/discord-icon.svg";
import facebookIcon from "@/src/assets/facebook-icon.svg";
import Image from "next/image";

interface LoginBoxProps {
    providers: Provider[]
}

// TODO - fix callback url, use callbackUrl from query parameter
const LoginBox = ({providers}: LoginBoxProps) => {

    const providerToIconMap:any = {
        google: googleIcon.src,
        discord: discordIcon.src,
        facebook: facebookIcon.src
    };
    
    return (
        <>
            <div className={styles.loginBoxWraper}>
                <div>
                    <Image src={logo} alt="dog_logo"/>
                    <div className={styles.logoName}>
                        doggosy
                    </div>
                    <div className={styles.callToAction}>
                        The best doggos are waiting for a date. Quciky check it out!
                    </div>
                </div>
                <div className={styles.loginBoxButtons}>
                    {Object.values(providers).map((provider:any) => (
                        <div className={styles.loginButton} key={provider.id}>
                            <Button size='large' fill='true' priority='mid' onClick={() => signIn(provider.id, { callbackUrl: '/account' })}>
                                <img src={providerToIconMap[provider.id]} className={styles.identityProviderIcon} alt="Identity provider" width='32' />
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
