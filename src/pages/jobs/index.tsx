import type { NextPage } from 'next'
import { trpc } from "@/src/utils/trpc";
import Header from '@/src/components/Header/Header';
import Footer from '@/src/components/Footer/Footer';
import JobListItem from '@/src/components/Job/JobListItem';
import DataPage from '@/src/components/DataPage/DataPage';

const Jobs: NextPage = () => {

    const query = trpc.useQuery(['jobs.getAllJobs']);

    return (
        <>
            <DataPage query={query}>
                <div className='layout'>
                    {query.data?.map((item:any) => (
                        <JobListItem job={item} key={item.id} />
                    ))}
                </div>
            </DataPage>
        </>
    );
}

export default Jobs;