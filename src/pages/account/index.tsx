import type { NextPage } from 'next';
import {useEffect, useState} from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { trpc } from "@/src/utils/trpc";
import axios from 'axios';
import Header from '@/src/components/Header/Header';
import PetBox from '@/src/components/PetBox/PetBox';
import styles from '@/src/styles/account/index.module.css'
import Footer from '@/src/components/Footer/Footer';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const Account: NextPage = () => {
    const { data: session } = useSession({ required: true });
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {register: registerNewPet, handleSubmit: handleSubmitNewPet, formState: { errors: errorsNewPet } } = useForm();

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
    const {data: petTypes} = trpc.useQuery(['pets.getPetTypes']);
    const [petType, setPetType] = useState('Dog');
    const [breedList, setBreedList] = useState<string[]>([]);

    useEffect(()=>{
        const chosenPetType = petTypes?.find(o => o.name === petType);
        const Arr = chosenPetType?.breeds?.split(',');
        if(Arr){
            setBreedList(Arr);
        }
    }, [petType, petTypes])

    const onChangePetType = (e: any) => {
        setPetType(e.target.value);
    }

    const onNameSubmit = async (data: any) => {
        console.log(session.user.id)
//        const s3FileUploadUrl = await getS3FileUploadUrl({ name: data.petImage[0].name, type: data.petImage[0].type });
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
            born_at: selectedDay.toISOString(),
            image: data.petImage[0].name
        })
    }

    //presets for the datePicker -> dog's age
    const today: Date = new Date();
    const [selectedDay, setSelectedDay] = useState<any>(today);

    return (
        <>
        <Header />
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1>Your data</h1>
                <div>
                    <form onSubmit={handleSubmit(onNameSubmit)}>
                        <div className="inputContainer">
                            <input type="file" {...register('userImage', { required: true })} />
                            {errors.userImage && <span className='input-error'>This field is required</span>}
                            <input placeholder={session?.user?.name || 'your name'} {...register('name', { required: true })} className='input' />
                            {errors.name && <span className='input-error'>This field is required</span>}
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
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
                    <select placeholder='Type of your pet' {...registerNewPet("type", { required: true })} className='input' onChange={(e)=>onChangePetType(e)} >
                        {petTypes?.map((petType)=>(
                                <option key={petType.name} value={petType.name}>
                                    {petType.name}
                                </option>
                        ))}
                    </select>
                    {errorsNewPet.type && <span className='input-error'>This field is required</span>}
                </div>
                {/* TODO load available breeds based on chosen pet type */}
                <div className="inputContainer">
                    <select placeholder='Breed of your pet' {...registerNewPet('breed', { required: true })} className='input'>
                        {breedList?.map((breed)=>(
                                <option key={breed} value={breed}>{breed}</option>
                        ))}
                    </select>
                    {errorsNewPet.breed && <span className='input-error'>This field is required</span>}
                </div>
                <div className="inputContainer">
                    <textarea placeholder='Bio.. write something about your pet' {...registerNewPet('bio', { required: false })} className='input' />
                </div>
                {/* TODO inplement a datePicker */}
                <div className="inputContainer">
                    <DayPicker
                        fromYear={2005}
                        toYear={2022}
                        captionLayout="dropdown"
                        mode="single"
                        required
                        selected={selectedDay}
                        onSelect={setSelectedDay}
                    />
                </div>
                <button type="submit">Add a pet</button>
            </form>
        </div>

    <Footer />
    </>
    );
}

export default Account;