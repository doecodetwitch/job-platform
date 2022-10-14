import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { trpc } from "@/src/utils/trpc";
import axios from 'axios';
import Header from '@/src/components/Header/Header';
import PetBox from '@/src/components/PetBox/PetBox';
import styles from '@/src/styles/account/index.module.css'
import Footer from '@/src/components/Footer/Footer';

const Account: NextPage = () => {
    const { data: session } = useSession({ required: true });
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerNewPet, handleSubmit: handleSubmitNewPet, formState: { errors: errorsNewPet } } = useForm();

    const editUsernameMutation = trpc.useMutation('account.updateName', {
        onSuccess: () => {
            window.location.reload()
            console.log('success')
        },
        onError: (error) => {
            console.log(`Something went wrong: ${error.message}`)
        },
    })

    //create mutation for adding a pet to the database
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

    //on the form submit, use mutation created above
    const { mutateAsync: getS3FileUploadUrl } = trpc.useMutation('account.getS3UrlPromise');
    const onCreatePetSubmit = async (data: any) => {
        const s3FileUploadUrl = await getS3FileUploadUrl({ name: data.petImage[0].name, type: data.petImage[0].type });
        await axios.put(s3FileUploadUrl, data.petImage[0], {
            headers: {
                "Content-type": data.petImage[0].type,
                "Access-Control-Allow-Origin": "*",
            }
        });

        addPetMutation.mutate({
            name: data.petName,
            type: data.type,
            breed: data.breed,
            bio: data.bio,
            born_at: data.born_at,
            image: data.petImage[0].name
        })
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
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

                <div className={styles.myPetsContainer}>
                    {myPets.data?.map((pet) => (
                        <div key={pet.id} className='col-span-4'>
                            <PetBox pet={pet} />
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
                        <div className="inputContainer">
                            <input type='file' placeholder='Name of your pet' {...registerNewPet('petImage', { required: true })} className='input' />
                            {errorsNewPet.petImage && <span className='input-error'>This field is required</span>}
                        </div>
                        {/* TODO load available pet types from db */}
                        <div className="inputContainer">
                            <select placeholder='Type of your pet' {...registerNewPet('type', { required: true })} className='input'>
                                <option value="dog">Dog</option>
                                <option value="cat">Cat</option>
                                <option value="lizard">Lizard</option>
                            </select>
                            {errorsNewPet.type && <span className='input-error'>This field is required</span>}
                        </div>
                        {/* TODO load available breeds based on chosen pet type */}
                        <div className="inputContainer">
                            <select placeholder='Breed of your pet' {...registerNewPet('breed', { required: true })} className='input'>
                                <option value="amstaff">Amstaff</option>
                                <option value="husky">Husky</option>
                                <option value="samoyed">Samoyed</option>
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
            <Footer />
        </>
    );
}

export default Account;