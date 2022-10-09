import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { trpc } from "@/src/utils/trpc";
import Header from '@/src/components/Header/Header';
import styles from '@/src/styles/account/index.module.css'

const Account: NextPage = () => {
    const { data: session } = useSession({required: true});
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerNewPet, handleSubmit: handleSubmitNewPet, formState: { errors: errorsNewPet } } = useForm();
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

    const addPetMutation = trpc.useMutation('account.addPet', {
        onSuccess: () => {
            window.location.reload()
            console.log('success')
        },
        onError: (error) => {
            console.log(`Something went wrong: ${error.message}`)
        },
    })

    const myPets = trpc.useQuery(['account.getMyPets']);

    const onNameSubmit = (data: any) => {
        editUsernameMutation.mutate({
            name: data.name
        })
    }

    const onCreatePetSubmit = (data: any) => {
        addPetMutation.mutate({
            name: data.petName,
            type: data.type,
            breed: data.breed,
            bio: data.bio,
            born_at: data.born_at,
        })
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.formContainer}>
                <h1>Your data</h1>
                <div>
                    <form onSubmit={handleSubmit(onNameSubmit)}>
                        <div className="inputContainer">
                            <input placeholder={session?.user?.name || 'your name'} {...register('name', { required: true })} className='input' />
                            {errors.name && <span className='input-error'>This field is required</span>}
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>

            <div className={styles.formContainer}>
                {myPets.data?.map((pet) => (
                    <div key={pet.id}>
                        {pet.name}
                    </div>
                ))}
            </div>

            <div className={styles.formContainer}>
                <h2>Create a pet profile</h2>
                <form onSubmit={handleSubmitNewPet(onCreatePetSubmit)}>
                    <div className="inputContainer">
                        <input placeholder='Name of your pet' {...registerNewPet('petName', { required: true })} className='input' />
                        {errorsNewPet.petName && <span className='input-error'>This field is required</span>}
                    </div>
                    {/* TODO load available pet types from db */}
                    <div className="inputContainer">
                        <select placeholder='Type of your pet' {...registerNewPet('type', { required: true })} className='input'>
                            <option value="dog">Dog</option>
                            <option value="dog">Cat</option>
                            <option value="dog">Lizard</option>
                        </select>
                        {errorsNewPet.type && <span className='input-error'>This field is required</span>}
                    </div>
                    {/* TODO load available breeds based on chosen pet type */}
                    <div className="inputContainer">
                        <select placeholder='Breed of your pet' {...registerNewPet('breed', { required: true })} className='input'>
                            <option value="dog">Amstaff</option>
                            <option value="dog">Husky</option>
                            <option value="dog">Samoyed</option>
                        </select>
                        {errorsNewPet.breed && <span className='input-error'>This field is required</span>}
                    </div>
                    <div className="inputContainer">
                        <textarea placeholder='Bio.. write something about your pet' {...registerNewPet('bio', { required: false })} className='input' />
                    </div>
                    {/* TODO inplement a datePicker */}
                    <div className="inputContainer">
                        <input placeholder="Your pet's date of birth" {...registerNewPet('born_at', { required: true })} className='input' />
                        {errorsNewPet.born_at && <span className='input-error'>This field is required</span>}
                    </div>
                    <button type="submit">Add a pet</button>
                </form>
            </div>
        </div>
    );
}

export default Account;