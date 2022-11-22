import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { trpc } from "@/src/utils/trpc";
import axios from 'axios';
import Header from '@/src/components/Header/Header';
import PetBox from '@/src/components/PetBox/PetBox';
import styles from '@/src/styles/account/index.module.css'
import Footer from '@/src/components/Footer/Footer';
import JobForm from '@/src/components/Account/JobForm/JobForm';
import Button from '@/src/components/Button/Button';
import JobListItem from '@/src/components/Job/JobListItem';
import Link from 'next/link';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const Account: NextPage = () => {
    const { data: session } = useSession({ required: true });
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerNewPet, handleSubmit: handleSubmitNewPet, formState: { errors: errorsNewPet } } = useForm();
    const jobFormRef = useRef<HTMLDivElement>(null);

    const handleOpenJobForm = () => {
        if (jobFormRef.current) {
            jobFormRef.current.classList.remove('hidden')
            jobFormRef.current.classList.add('flex')
        }
    }

    const handleCloseJobForm = () => {
        if (jobFormRef.current) {
            jobFormRef.current.classList.remove('flex')
            jobFormRef.current.classList.add('hidden')
        }
    }

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

    const { data: myJobs } = trpc.useQuery(['account.getMyJobs']);
    const myPets = trpc.useQuery(['account.getMyPets']);
    const { data: petTypes } = trpc.useQuery(['pets.getPetTypes']);
    const [petType, setPetType] = useState('Dog');
    const [breedList, setBreedList] = useState<string[]>([]);

    useEffect(() => {
        const chosenPetType = petTypes?.find(o => o.name === petType);
        const Arr = chosenPetType?.breeds?.split(',');
        if (Arr) {
            setBreedList(Arr);
        }
    }, [petType, petTypes])

    const onChangePetType = (e: any) => {
        setPetType(e.target.value);
    }

    const onNameSubmit = async (data: any) => {
        const userImageName = session?.user?.id + data.userImage[0].name;
        const s3FileUploadUrl = await getS3FileUploadUrl({ name: userImageName, type: data.userImage[0].type });

        await axios.put(s3FileUploadUrl, data.userImage[0], {
            headers: {
                "Content-type": data.userImage[0].type,
                "Access-Control-Allow-Origin": "*",
            }
        }).then(() => {
            editUsernameMutation.mutate({
                name: data.name,
                image: process.env.NEXT_PUBLIC_S3_BUCKET_URL + userImageName
            })
        });
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
        }).then(() => {
            addPetMutation.mutate({
                name: data.petName,
                type: data.type,
                breed: data.breed,
                bio: data.bio,
                born_at: selectedDay.toISOString(),
                image: data.petImage[0].name
            })
        });
    }

    //presets for the datePicker -> dog's age
    const today: Date = new Date();
    const [selectedDay, setSelectedDay] = useState<any>(today);

    return (
        <div className='layout'>
        <Header />
        <h1 className={styles.dataSectionTitle}>Tutaj możesz zmienić swój ryjec i imię swoje też.</h1>
        <p className={styles.dataSectionDescription}>Ale bez chirurga może to się nie udać, a poza tym nwm co na to CBŚ.</p>
        <div className='w-full flex space-x-2'>
            <div className='py-4 hover:bg-amber-50 px-2'>
                <Link href='/account/friends'>My friends</Link>
            </div>
        </div>

        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1>Your data</h1>
                <div>
            <div className={styles.dataSectionContainer}>
                <div className={styles.dataSectionFormContainer}>
                    <form onSubmit={handleSubmit(onNameSubmit)}>
                        <div>
                            <label htmlFor="userImage" className=''>
                                <div className={styles.userImageContainer}>
                                    {session?.user?.image ?
                                        <img src={session?.user?.image} className={styles.userImage} alt="" /> : null}
                                    <input id="userImage" className="hidden" type="file" {...register('userImage', { required: true })} />
                                    {errors.userImage && <p className={styles.inputError}>This field is required</p>}
                                    <div className={styles.userImageOverlay}><p className={styles.userImageOverlayText}>Change avatar</p></div>
                                </div>
                            </label>
                            <input placeholder={session?.user?.name || 'your name'} {...register('name', { required: true })} className={styles.usernameInput} />
                            {errors.name && <p className={styles.inputError}>This field is required</p>}
                        </div>
                        <Button priority="low">Submit</Button>
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
                        <select placeholder='Type of your pet' {...registerNewPet("type", { required: true })} className='input' onChange={(e) => onChangePetType(e)} >
                            {petTypes?.map((petType) => (
                                <option key={petType.name} value={petType.name}>
                                    {petType.name}
                                </option>
                        ))}
                        </select>
                        {errorsNewPet.type && <span className='input-error'>This field is required</span>}
                    </div>
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

            <div>
                {myJobs?.map((item:any)=>(
                    <JobListItem job={item} key={item.id} mode='myAccount' />
                ))}
                <Button onClick={()=>{ handleOpenJobForm() }} priority="low">Add a new job</Button>
                <div ref={jobFormRef} className='hidden fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 place-items-center place-content-center'>
                    <div className='relative r-0'>Close</div>
                    <JobForm myPets={myPets} closeJobForm={handleCloseJobForm} />
                </div>
            </div>
        <Footer />
        </div>
        </div>
        </div>
        </div>
    );
}

export default Account;