import {trpc} from "@/src/utils/trpc";
import Button from '@/src/components/Button/Button';

const FriendRequestDetail = (props: any) => {
    const { data: friendRequestDetails } = trpc.useQuery(['account.getFriendRequestDetails', {id: props.request.id}]);

    const acceptFriendRequestMutation = trpc.useMutation('account.acceptFriendRequest', {
        onSuccess: () => {
            window.location.reload()
            console.log('success')
        },
        onError: (error) => {
            console.log(`Something went wrong: ${error.message}`)
        },
    })

    const declineFriendRequestMutation = trpc.useMutation('account.declineFriendRequest', {
        onSuccess: () => {
            window.location.reload()
            console.log('success')
        },
        onError: (error) => {
            console.log(`Something went wrong: ${error.message}`)
        },
    })

    return (
        <div className='py-6 flex space-x-4'>
            <div>
                {friendRequestDetails?.sender?.image ?
                <img src={friendRequestDetails?.sender?.image} alt="Sender photo" className='rounded-full max-w-[100px]' /> :
                null}
            </div>
            <div className='flex items-center'>
                <p>
                    {friendRequestDetails?.sender?.name + ' wants to be your friend!'}
                </p>
                <Button priority='low' onClick={()=>{acceptFriendRequestMutation.mutate({id: props.request.id})}}>Accept</Button>
                <Button onClick={()=>{declineFriendRequestMutation.mutate({id: props.request.id})}}>Decline</Button>
            </div>
        </div>
    );
}

export default FriendRequestDetail;