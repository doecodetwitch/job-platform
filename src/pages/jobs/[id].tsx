import type { NextPage } from 'next'
import { trpc } from "@/src/utils/trpc";
import { useRouter } from 'next/router';
import DataPage from '@/src/components/DataPage/DataPage';
import {isString, isUndefined} from "is-what";

const Jobs: NextPage = () => {
    const router = useRouter();
    if (isUndefined(router.query.id) || !isString(router.query.id)) {
        return(<>
            <h1>This job no longer exist.</h1>
        </>)
    }
    const query = trpc.useQuery(['jobs.getJobById', {id: router.query.id}]);

    return (
        <>
            <DataPage query={query}>
                    <p>job id: {query.data?.id }</p>
                    <p>job title: {query.data?.title}</p>
                    <p>description: {query.data?.description}</p>
                    <p>status: {query.data?.status}</p>
                    <p>price: {query.data?.price}</p>
                    <p>contact email: {query.data?.contactEmail}</p>
                    <p>contact number: {query.data?.contactNumber}</p>
                    <p>nazwa pieska: {query.data?.pet.name}</p>
            </DataPage>
        </>
    )
}

export default Jobs;