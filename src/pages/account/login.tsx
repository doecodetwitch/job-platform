import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import styles from '@/src/styles/account/log-in.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router';

const Login: NextPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data: {}) => {
        console.log(data)
    }

    console.log(session)

    if (session) {
        return (
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <h2>
                        You are already logged in.
                    </h2>
                    <div className='flex space-x-2'>
                        <button onClick={()=>(router.push('/'))}>Home</button>
                        <button onClick={()=>(signOut())}>Log out</button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
                    <div className="inputContainer">
                        <input placeholder="email" {...register('email', { required: true })} />
                        {errors.email && <span className='input-error'>This field is required</span>}
                    </div>
                    <div className="inputContainer">
                        <input placeholder="password" {...register('password', { required: true })} />
                        {errors.password && <span className='input-error'>This field is required</span>}
                    </div>
                    <button type="submit">Submit</button>
                </form>
                <button onClick={()=>signIn()}>Log in with Google</button>
            </div>
        );
    }
}

export default Login;