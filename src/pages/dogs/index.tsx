import type { NextPage } from 'next'
import { trpc } from "@/src/utils/trpc";

import PetBox from '@/src/components/PetBox/PetBox';
import DataPage from '@/src/components/DataPage/DataPage';

const Pets: NextPage = () => {

    const query = trpc.useQuery(['pets.getAllPets']);
    const sendFriendRequestMutation = trpc.useMutation('account.sendFriendRequest', {
        onSuccess: () => {
            console.log('success');
        },
        onError: (error) => {
            console.log('error', error);
        },
    })
   
    return (
        <DataPage query={query}>
            <div className='mx-4'>
            <div className='grid gap-x-6 gap-y-6 grid-cols-12 justify-items-center'>
                {query.data?.map((item) => (
                    <div key={item.id} className='col-span-12 sm:col-span-6 lg:col-span-4'>
                        <PetBox pet={item} mode='petListing' sendFriendRequestMutation={sendFriendRequestMutation} />
                    </div>
                ))}
            </div>
            </div>
        </DataPage>
    );
}

export default Pets;