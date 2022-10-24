import type { NextPage } from 'next'
import { trpc } from "@/src/utils/trpc";
import Header from '@/src/components/Header/Header';
import Footer from '@/src/components/Footer/Footer';
import JobListItem from '@/src/components/Job/JobListItem';

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
            <div className='layout'>
                {jobs.data?.map((item) => (
                    <JobListItem job={item} key={item.id} />
                ))}
            </div>
            <Footer />
        </>
    );
}

export default Jobs;