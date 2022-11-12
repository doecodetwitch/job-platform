import { useForm } from 'react-hook-form';
import { trpc } from "@/src/utils/trpc";
import Button from '@/src/components/Button/Button';

const AccountJobDetail = (props: any) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: props.job
    });

    const editJobMutation = trpc.useMutation('account.editJob', {
        onSuccess: () => {
            window.location.reload()
            console.log('success')
        },
        onError: (error) => {
            console.log(`Something went wrong: ${error.message}`)
        },
    })

    const deleteJobMutation = trpc.useMutation('account.deleteJob', {
        onSuccess: () => {
            window.location.reload()
            console.log('success')
        },
        onError: (error) => {
            console.log(`Something went wrong: ${error.message}`)
        },
    })

    const onSubmit = (data: any) => {
        editJobMutation.mutate({
            id: props.job.id,
            title: data.title,
            description: data.description,
            price: parseFloat(data.price),
            contactEmail: data.contactEmail,
            contactNumber: data.contactNumber,
        })
    }

    return (
            <div className='min-w-[400px] bg-white p-6'>
                <span className='flex items-center mb-4 space-x-full'>
                    <h3 className='grow'>Edit this job</h3>
                    <Button onClick={()=>{props.closeEdit()}} priority='high'>Close</Button>
                </span>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
                    <input className='input' placeholder='Title' {...register('title', { required: true })} />
                    {errors.title && <span className='input-error'>This field is required</span>}
                    <textarea className='input' placeholder='Description' {...register('description', { required: false })} />
                    {errors.description && <span className='input-error'>This field is required</span>}
                    <input className='input' placeholder='Price $$$' {...register('price', { required: false })} />
                    {errors.price && <span className='input-error'>This field is required</span>}
                    <input className='input' placeholder='Your email' {...register('contactEmail', { required: false })} />
                    <input className='input' placeholder='Your phone number' {...register('contactNumber', { required: false })} />
                    <Button priority='mid'>Confirm</Button>
                </form>

                <div className='border-t-2 mt-6 pt-4 w-full flex items-center'>
                    <p>Delete the job</p>
                    <Button priority='high' onClick={()=>(deleteJobMutation.mutate({id: props.job.id}))}>Delete</Button>
                </div>
            </div>
    );
}

export default AccountJobDetail;
