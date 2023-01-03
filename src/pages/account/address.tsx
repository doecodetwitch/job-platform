import type { NextPage } from 'next';
import { trpc } from "@/src/utils/trpc";
import Button from "@/src/components/Button/Button";
import DataPage from '@/src/components/DataPage/DataPage';
import React, { ChangeEvent, Dispatch } from 'react';

interface UserAddress {
    country: string;
    city: string;
    houseNumber: string;
    street: string;
    postalCode: string;
  }

const AddressPage: NextPage = () => {
    const query = trpc.useQuery(['account.getUserAddress'], {
        onSuccess: (data) => setUserAddress({
            city: data?.city || '',
            country: data?.country || '',
            postalCode: data?.postalCode || '',
            street: data?.postalCode || '',
            houseNumber: data?.postalCode || '',
        })
    });
    const [message, setMessage] = React.useState<string>();
    const [userAddress, setUserAddress] = React.useState<UserAddress>({
        country: '',
        city: '',
        postalCode: '',
        street: '',
        houseNumber: '',
    });

    const onAddressSubmit = () => {
        trpc.useMutation('account.updateUserAddress', {
            onSuccess: () => {
                setMessage('Address has been saved successfully.');
            },
            onError: (error) => {
                setMessage('Something went wrong. Please try again later.');
            },
        }).mutate(userAddress)
    };

    const onCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserAddress((userAddress: UserAddress) => {
            console.log("dupa");
            userAddress.country = event.target.value;
            console.log(userAddress);
            return userAddress
        });
    };

    const onCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserAddress((userAddress: UserAddress) => {
            userAddress.city = event.target.value;
            return userAddress
        });
    };
    
    const onStreetChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserAddress((userAddress: UserAddress) => {
            userAddress.street = event.target.value;
            return userAddress
        });
    };
    
    const onHouseNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserAddress((userAddress: UserAddress) => {
            userAddress.houseNumber = event.target.value;
            return userAddress
        });
    };
    
    const onPostalCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserAddress((userAddress: UserAddress) => {
            userAddress.postalCode = event.target.value;
            return userAddress
        });
    };

    return (<>
        <DataPage query={query}>
            <div>

                <label htmlFor="country">Contry</label>
                <input type="text" id="counry" value={userAddress.country} onChange={onCountryChange}></input>

                <label htmlFor="city">City</label>
                <input type="text" id="city" value={userAddress.city} onChange={onCityChange}></input>

                <label htmlFor="street">Street</label>
                <input type="text" id="streer" value={userAddress.street} onChange={onStreetChange}></input>

                <label htmlFor="houseNumber">House Number</label>
                <input type="text" id="houseNumber" value={userAddress.houseNumber} onChange={onHouseNumberChange}></input>

                <label htmlFor="postalCode">Postal Code</label>
                <input type="text" id="postalCode" value={userAddress.postalCode} onChange={onPostalCodeChange}></input>

                <Button onClick={onAddressSubmit}>Save</Button>
                <div>{message}</div>

            </div>
        </DataPage>
    </>);
}

export default AddressPage;