import type { NextPage } from 'next';
import { trpc } from "@/src/utils/trpc";
import Button from "@/src/components/Button/Button";
import DataPage from '@/src/components/DataPage/DataPage';
import React, { useState } from 'react';
import styles from '@/src/styles/account/address.module.css'
import AutocompleteAddress from '@/src/components/AutocompleteAddress/AutocompleteAddress';
import AutocompleteAddressContext from '@/src/components/AutocompleteAddress/AutocompleteAddressContext';
import { CountyCode } from '@geoapify/geocoder-autocomplete';

const AddressPage: NextPage = () => {
    const skipDetails = true;
    const [countryCode, setCountryCode] = useState<CountyCode>('none');
    const [country, setCountry] = useState<string | undefined>(undefined);
    const [city, setCity] = useState<string | undefined>(undefined);
    const [street, setStreet] = useState<string | undefined>(undefined);
    const [houseNumber, setHouseNumber] = useState<string | undefined>(undefined);
    const [postalCode, setPostalCode] = useState<string | undefined>(undefined);
    const [message, setMessage] = React.useState<string | undefined>(undefined);

    const onCountrySelectedHandler = (location: any) => {
        const code = location?.properties?.country_code
        const country = location?.properties?.country

        if (code && country) {
            setCountryCode(code);
            setCountry(country);
        }
        else {
            setCountryCode('none');
            setCountry(undefined);
        }
    }

    const onCitySelectedHandler = (location: any) => {
        const city = location?.properties?.city

        if (city) {
            setCity(city);
        }
        else {
            setCity(undefined);
        }
    }

    const onStreetSelectedHandler = (location: any) => {
        const street = location?.properties?.street

        if (street) {
            setStreet(street);
        }
        else {
            setStreet(undefined);
        }
    }

    const onHouseNumberSelectedHandler = (location: any) => {
        const houseNumber = location?.properties?.housenumber
        if (houseNumber) {
            setHouseNumber(houseNumber);
        }
        else {
            setStreet(undefined);
        }
    }

    const onPostalCodeSelectedHandler = (location: any) => {
        const postalCode = location?.properties?.postcode

        if (postalCode) {
            setPostalCode(postalCode);
        }
        else {
            setPostalCode(undefined);
        }
    }

    const onCityPopulateInputHandler = (location: any) => {
        return location?.properties?.city
    }

    const onStreetPopulateInputHandler = (location: any) => {
        return location?.properties?.street
    }

    const onHouseNumberPopulateInputHandler = (location: any) => {
        return location?.properties?.housenumber
    }

    const onPostalCodePopulateInputHandler = (location: any) => {
        return location?.properties?.postcode
    }


    const onSuggestionFilterCitiesHandler = (locations: any[]) => {
        const processed: any[] = [];

        const filtered = locations.filter(location => {
            const city = location?.properties?.city

            if (!city || processed.indexOf(city) >= 0) {
                return false;
            } else {
                processed.push(city);
                return true;
            }

        });

        return filtered;
    }

    const onSuggestionFilterStreetsHandler = (locations: any[]) => {
        const processed: any[] = [];

        const filtered = locations.filter(location => {
            const street = location?.properties?.street

            if (!street || processed.indexOf(street) >= 0) {
                return false;
            } else {
                processed.push(street);
                return true;
            }

        });

        return filtered;
    }

    const onSuggestionFilterHouseNumberHandler = (locations: any[]) => {
        const processed: any[] = [];

        const filtered = locations.filter(location => {
            const houseNumber = location?.properties?.housenumber

            if (!houseNumber || processed.indexOf(houseNumber) >= 0) {
                return false;
            } else {
                processed.push(houseNumber);
                return true;
            }

        });

        return filtered;
    }

    const onSuggestionFilterPostalCodeHandler = (locations: any[]) => {
        const processed: any[] = [];

        const filtered = locations.filter(location => {
            const postalCode = location?.properties?.postcode

            if (!postalCode || processed.indexOf(postalCode) >= 0) {
                return false;
            } else {
                processed.push(postalCode);
                return true;
            }

        });

        return filtered
    }

    const onSearchByPhraseHouseNumberHandler = (phrase: string) => {
        return `${street} ${phrase} ${city}, ${country}`;
    }

    const onSearchByPhrasePostCodeHandler = (phrase: string) => {
        return `${street} ${houseNumber} ${city}, ${country}`;
    }

    const postprocessCity = (data: any) => {
        return data?.properties?.city
    }

    const query = trpc.useQuery(['account.getUserAddress'], {
        onSuccess: (data) => {
            setCountry(data?.country),
            setCity(data?.city),
            setStreet(data?.street),
            setHouseNumber(data?.houseNumber),
            setPostalCode(data?.postalCode)
        }
    });

    const updateAddressMutation = trpc.useMutation('account.updateUserAddress', {
        onSuccess: () => {
            setMessage('Address has been saved successfully.');
        },
        onError: (error) => {
            setMessage('Something went wrong. Please try again later.');
        },
    })

    const handleSave = (event: EventTarget) => {
        updateAddressMutation.mutate({
            city: city || '',
            country: country || '',
            street: street || '',
            houseNumber: houseNumber || '',
            postalCode: postalCode || ''
        });
    }

    const emptyCheck = (property: any) => {
        return property == null 
            || property == undefined
            || property == '';
    }

    return (<>
        <DataPage query={query}>
            <AutocompleteAddressContext apiKey='e247d8c43beb4b9fa47236ba3643320d'>
                <div className={styles.page}>

                    <div className={styles.container}>
                        <div className={styles.label}>
                            Country:
                        </div>
                        <div className={styles.addressField}>
                            <AutocompleteAddress
                                type='country'
                                value={country}
                                onLocationSelected={onCountrySelectedHandler}
                                skipDetails={skipDetails}
                            />
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.label}>
                            City:
                        </div>
                        <div className={styles.addressField}>
                            <AutocompleteAddress
                                type='city'
                                value={city}
                                disabled={emptyCheck(country)}
                                filterByCountry={[countryCode]}
                                onPopulateInput={onCityPopulateInputHandler}
                                onLocationSelected={onCitySelectedHandler}
                                onSuggestionFilter={onSuggestionFilterCitiesHandler}
                                skipDetails={skipDetails}
                            />
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.label}>
                            Street:
                        </div>
                        <div className={styles.addressField}>
                            <AutocompleteAddress
                                type='street'
                                value={street}
                                disabled={emptyCheck(city)}
                                filterByCountry={[countryCode]}
                                onPopulateInput={onStreetPopulateInputHandler}
                                onLocationSelected={onStreetSelectedHandler}
                                onSuggestionFilter={onSuggestionFilterStreetsHandler}
                                skipDetails={skipDetails}
                            />
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.label}>
                            Building Number:
                        </div>
                        <div className={styles.addressField}>
                            <AutocompleteAddress
                                value={houseNumber}
                                disabled={emptyCheck(street)}
                                filterByCountry={[countryCode]}
                                onSearchByPhrase={onSearchByPhraseHouseNumberHandler}
                                onPopulateInput={onHouseNumberPopulateInputHandler}
                                onLocationSelected={onHouseNumberSelectedHandler}
                                onSuggestionFilter={onSuggestionFilterHouseNumberHandler}
                                skipDetails={skipDetails}
                            />
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.label}>
                            Postal code:
                        </div>
                        <div className={styles.addressField}>
                            <AutocompleteAddress
                                value={postalCode}
                                disabled={emptyCheck(houseNumber)}
                                filterByCountry={[countryCode]}
                                onSearchByPhrase={onSearchByPhrasePostCodeHandler}
                                onPopulateInput={onPostalCodePopulateInputHandler}
                                onLocationSelected={onPostalCodeSelectedHandler}
                                onSuggestionFilter={onSuggestionFilterPostalCodeHandler}
                                skipDetails={skipDetails}
                            />
                        </div>
                    </div>

                </div>
            </AutocompleteAddressContext>

            <Button onClick={handleSave}>Save</Button>
            <div>{message}</div>

        </DataPage >
    </>);
}

export default AddressPage;