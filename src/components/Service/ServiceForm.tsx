import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import styles from "@/src/styles/account/index.module.css";
import Button from "@/src/components/Button/Button";
import { trpc } from "@/src/utils/trpc";
import {useMutation} from "react-query";
import z from "zod";

const ServiceForm = (props: any) => {
    const {data: session} = useSession();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const addServiceToMyWorkingAccountMutation = trpc.useMutation('account.addServiceToMyWorkingAccount', {
        onSuccess: () => {
            window.location.reload();
        },
        onError: (err) => {
            console.log('Error occured', err);
        }
    })

    const onServiceSubmit = async (data: any) => {
        //add mutation for adding / editing a service
        addServiceToMyWorkingAccountMutation.mutate({
            name: data.name,
            description: data.description,
            price: parseFloat(data.price),
            type: parseInt(data.type),
            workingUserId: props.workingAccountId
        });
    }

    const {data: services} = trpc.useQuery(["account.getAllServiceTypes"]);
    console.log(services)

    return (
        <div className='fixed bg-white top-0 left-0 w-screen h-screen z-50 overflow-scroll flex justify-center items-center flex-col'>
            <form onSubmit={handleSubmit(onServiceSubmit)}>
                <p className='text-gray-500'>Describe and add the service you would like to provide to people and their pets.</p>
                <br />
                <div className='flex flex-col'>
                    <select placeholder='Service type' {...register("type", { required: true })} className='input'>
                        {services?.map((serviceType:any)=>(
                            <option key={serviceType.id} value={serviceType.id}>
                                {serviceType.type}
                            </option>
                        ))}
                    </select>
                    <input placeholder={'Title'} {...register('name', { required: true })} className='input' />
                    {errors.name && <p className={styles.inputError}>This field is required</p>}
                    <textarea placeholder={'Description'} {...register('description', { required: true })} className='input' />
                    {errors.description && <p className={styles.inputError}>This field is required</p>}
                    <input placeholder={'Price'} {...register('price', { required: true })} className='input' />
                    {errors.price && <p className={styles.inputError}>This field is required</p>}
                </div>
                <Button priority="high">Submit</Button>
            </form>
            <Button priority="lower" onClick={()=>props.handleToggleServiceForm()}>Close</Button>
        </div>
    );
}

export default ServiceForm;
