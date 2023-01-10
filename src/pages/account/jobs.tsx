import type { NextPage } from 'next';
import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { trpc } from "@/src/utils/trpc";
import axios from 'axios';
import Header from '@/src/components/Header/Header';
import styles from '@/src/styles/account/jobs.module.css'
import Footer from '@/src/components/Footer/Footer';
import JobForm from '@/src/components/Account/JobForm/JobForm';
import Button from '@/src/components/Button/Button';
import JobListItem from '@/src/components/Job/JobListItem';
import 'react-day-picker/dist/style.css';
import AccountMenu from '@/src/components/Account/AccountMenu/AccountMenu';

const Jobs: NextPage = () => {
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
            <AccountMenu />
            <div className='mx-4'>
            <div className={styles.titleOfSectionContainer}>
                <p className={styles.titleOfSection}>Your jobs</p>
                <p className={styles.descriptionOfSection}>Check your jobs and do sth!</p>
             </div>
            <div className={styles.container2}>
                <div className={styles.formContainer}>
                    {/* <h1>Your data</h1> */}
                    <div>
                        <div>
                            {myJobs?.map((item: any) => (
                                <JobListItem job={item} key={item.id} mode='myAccount' />
                            ))}
                            <div className='mt-4'>
                                <Button onClick={() => { handleOpenJobForm() }} priority="low">Add a new job</Button>
                            </div>
                            <div ref={jobFormRef} className='fixed bg-white top-0 left-0 w-screen h-screen z-50 overflow-scroll flex justify-center items-center flex-col px-4'>
                                <JobForm myPets={myPets} closeJobForm={handleCloseJobForm} />
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Jobs;
