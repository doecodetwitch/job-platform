import type { NextPage } from 'next';
import {trpc} from "@/src/utils/trpc";
import FriendRequestDetail from "@/src/components/Account/FriendRequestDetail/FriendRequestDetail";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer/Footer";
import Button from "@/src/components/Button/Button";

const Friends: NextPage = () => {
    const { data: userDetails } = trpc.useQuery(['account.getUserDetails']);

    return (
        <>
            <div className='layout'>
                <Header />

                <h2 className='font-display text-3xl tracking-tight sm:text-4xl md:text-5xl'>Yo, these people want to be your friends!</h2>
                {userDetails?.receivedFriendRequests.map((request)=>(
                    <div key={request.id}>
                        <FriendRequestDetail request={request} />
                    </div>
                ))}

                <h2 className='font-display text-3xl tracking-tight sm:text-4xl md:text-5xl'>You have {userDetails?.friends.length} friends</h2>
                {userDetails?.friends.map((friend)=>(
                    <div key={friend.id}>
                        <div className='py-6 flex space-x-4'>
                            <div>
                                {friend?.image ?
                                    <img src={friend?.image} alt="Sender photo" className='rounded-full max-w-[100px]' /> :
                                    null}
                            </div>
                            <div className='flex items-center'>
                                <p>
                                    {friend?.name + ' is your friend!'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                <Footer />
            </div>
        </>
    );
}

export default Friends;