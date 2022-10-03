import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { trpc } from "@/src/utils/trpc";
import Header from '@/src/components/Header/Header';
import styles from '@/src/styles/account/index.module.css'

const Account: NextPage = () => {
    const { data: session } = useSession({required: true});
    const { register, handleSubmit, formState: { errors } } = useForm();
    console.log(session)

    const editUsernameMutation = trpc.useMutation('account.updateName', {
        onSuccess: () => {
          window.location.reload()
          console.log('success')
        },
        onError: (error) => {
          console.log(`Something went wrong: ${error.message}`)
        },
      })

    const onSubmit = (data: any) => {
        editUsernameMutation.mutate({
            name: data.name
        })
    }
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.formContainer}>
                <h1>Your data</h1>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="inputContainer">
                            <input placeholder={session?.user?.name || 'your name'} {...register('name', { required: true })} className='input' />
                            {errors.name && <span className='input-error'>This field is required</span>}
                        </div>
                        {/* <div className="inputContainer">
                            <input placeholder={session?.user?.email || 'your email'} {...register('email', { required: true })} className='input' />
                            {errors.email && <span className='input-error'>This field is required</span>}
                        </div>
                        <div className="inputContainer">
                            <input placeholder="password" {...register('password', { required: true })} className='input' />
                            {errors.password && <span className='input-error'>This field is required</span>}
                        </div> */}
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Account;