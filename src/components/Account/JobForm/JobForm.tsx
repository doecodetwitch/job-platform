import { useForm } from 'react-hook-form';
import { trpc } from "@/src/utils/trpc";
import Button from '@/src/components/Button/Button';

const JobForm = (props: any) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const postJobMutation = trpc.useMutation('account.postJob', {
        onSuccess: () => {
            window.location.reload()
            console.log('success')
        },
        onError: (error) => {
            console.log(`Something went wrong: ${error.message}`)
        },
    })

    const onSubmit = (data: any) => {
        console.log(data)
        postJobMutation.mutate({
            petId: data.petId,
            title: data.title,
            description: data.description,
            price: parseFloat(data.price),
            contactEmail: data.contactEmail,
            contactNumber: data.contactNumber,
        })
    }

    return (
            <div className = ''>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <select placeholder='Your pet' {...register("petId", { required: true })} className='input'>
                        {props.myPets?.data?.map((pet:any)=>(
                            <option key={pet.id} value={pet.id}>
                                {pet.name}
                            </option>
                        ))}
                    </select>
                    <input className='input' placeholder='Title' {...register('title', { required: true })} />
                    {errors.title && <span className='input-error'>This field is required</span>}
                    <textarea className='input' placeholder='Description' {...register('description', { required: true })} />
                    {errors.description && <span className='input-error'>This field is required</span>}
                    <input className='input' placeholder='Price $$$' {...register('price', { required: true })} />
                    {errors.price && <span className='input-error'>This field is required</span>}
                    <input className='input' placeholder='Your email' {...register('contactEmail', { required: false })} />
                    <input className='input' placeholder='Your phone number' {...register('contactNumber', { required: false })} />
                    <Button priority='high'>Post a job</Button>
                </form>
            </div>
    );
}

export default JobForm;
