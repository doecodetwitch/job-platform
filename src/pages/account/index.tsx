import type { NextPage } from 'next';
import { useRef } from 'react';
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
import 'react-day-picker/dist/style.css';
import PetForm from '@/src/components/Account/PetForm/PetForm';

const Account: NextPage = () => {
    const { data: session } = useSession({ required: true });
    const { register, handleSubmit, formState: { errors } } = useForm();
    const jobFormRef = useRef<HTMLDivElement>(null);
    const petFormRef = useRef<HTMLDivElement>(null);

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

    const handleOpenPetForm = () => {
        if (petFormRef.current) {
            petFormRef.current.classList.remove('hidden')
            petFormRef.current.classList.add('flex')
        }
    }

    const handleClosePetForm = () => {
        if (petFormRef.current) {
            petFormRef.current.classList.remove('flex')
            petFormRef.current.classList.add('hidden')
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

    const { data: myJobs } = trpc.useQuery(['account.getMyJobs']);
    const myPets = trpc.useQuery(['account.getMyPets']);

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
                        <div>
                            <Button onClick={() => { handleOpenPetForm() }} priority="low">Add new pet</Button>
                            <div ref={petFormRef} className="hidden fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 place-items-center place-content-center">
                                <PetForm closePetForm={handleClosePetForm} />
                            </div>
                        </div>

                        <div>
                            {myJobs?.map((item: any) => (
                                <JobListItem job={item} key={item.id} mode='myAccount' />
                            ))}
                            <Button onClick={() => { handleOpenJobForm() }} priority="low">Add a new job</Button>
                            <div ref={jobFormRef} className='hidden fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 place-items-center place-content-center'>
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
