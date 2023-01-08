import type { NextPage } from 'next';
import { trpc } from "@/src/utils/trpc";
import Button from "@/src/components/Button/Button";
import DataPage from '@/src/components/DataPage/DataPage';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface UserAddress {
    country: string;
    city: string;
    houseNumber: string;
    street: string;
    postalCode: string;
  }

const AddressPage: NextPage = () => {
    const { register, handleSubmit } = useForm<UserAddress>();

    const query = trpc.useQuery(['account.getUserAddress'], {
        onSuccess: (data) => setCurrentUserAddress({
            city: data?.city || '',
            country: data?.country || '',
            street: data?.street || '',
            houseNumber: data?.houseNumber || '',
            postalCode: data?.postalCode || ''

        })
    });
    
    const [message, setMessage] = React.useState<string>();
    const [currentUserAddress, setCurrentUserAddress] = React.useState<UserAddress>();
    
    const updateAddressMutation =  trpc.useMutation('account.updateUserAddress', {
        onSuccess: () => {
            setMessage('Address has been saved successfully.');
        },
        onError: (error) => {
            setMessage('Something went wrong. Please try again later.');
        },
    })

    const onSubmit: SubmitHandler<UserAddress> = data =>  updateAddressMutation.mutate(data) ;

    return (<>
        <DataPage query={query}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <label htmlFor="country">Contry</label>
                <input type="text" id="counry" defaultValue={currentUserAddress?.country} {...register("country", { required: true, maxLength: 30 }) }></input>

                <label htmlFor="city">City</label>
                <input type="text" id="city" defaultValue={currentUserAddress?.city} {...register("city", { required: true, maxLength: 100 }) }></input>

                <label htmlFor="street">Street</label>
                <input type="text" id="street"  defaultValue={currentUserAddress?.street} {...register("street", { required: true, maxLength: 100 }) }></input>

                <label htmlFor="houseNumber">House Number</label>
                <input type="text" id="houseNumber" defaultValue={currentUserAddress?.houseNumber} {...register("houseNumber", { required: true, maxLength: 20 }) }></input>

                <label htmlFor="postalCode">Postal Code</label>
                <input type="text" id="postalCode" defaultValue={currentUserAddress?.postalCode} {...register("postalCode", { required: true, maxLength: 8 }) }></input>

                <Button type="submit">Save</Button>
                <div>{message}</div>

            </form>
        </DataPage>
    </>);
}

export default AddressPage;