import type { NextPage } from 'next'
import { trpc } from "@/src/utils/trpc";
import Header from '@/src/components/Header/Header';
import Footer from '@/src/components/Footer/Footer';

const Jobs: NextPage = () => {

    const jobs = trpc.useQuery(['jobs.getAllJobs']);

    if (!jobs.data) {
        return (
            <>
                <p>Loading...</p>
            </>
        )
    }

    return (
        <>
            <Header />
            <div className='grid gap-x-6 gap-y-6 grid-cols-12'>
                {jobs.data?.map((item) => (
                    <div key={item.id} className='col-span-12 p-4'>
                        <p className='my-4 font-medium'>{item.title} | {item.price}</p>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
}

export default Jobs;