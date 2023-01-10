import { useContext, useEffect, useRef, useState } from 'react';
import { GeocoderAutocomplete, LocationType, CountyCode } from '@geoapify/geocoder-autocomplete';
import styles from './AutocompleteAddress.module.css';
import { AutocompleteAddressCtx } from './AutocompleteAddressContext';

export interface AutocompleteAddressProps {
    placholder?: string;
    value?: string;
    maxSuggestions?: number;
    skipDetails?: boolean;
    type?: LocationType
    disabled?: boolean;
    filterByCountry?: CountyCode[]
    onSearchByPhrase?: (searchPhrase: string) => string;
    onPopulateInput?: (location: any) => string;
    onSuggestionFilter?: (locations: any[]) => any[];
    onLocationSelected?: (location: any) => void;
}

const AutocompleteAddress = (props: AutocompleteAddressProps) => {

    const apiKey = useContext(AutocompleteAddressCtx)
    const rootElementRef = useRef<HTMLDivElement>(null);
    const autoCompleteRef = useRef<GeocoderAutocomplete>();
    let isInitialized = false;
    let defaultSuggestionCount: 5;
    let defaultPlaceholder: "Please enter an address";


    useEffect(() => {
        if (!isInitialized) {
            autoCompleteRef.current = new GeocoderAutocomplete(
                rootElementRef.current as HTMLElement,
                apiKey,
                {
                    placeholder: props.placholder || defaultPlaceholder,
                    skipDetails: props.skipDetails || false,
                });

            isInitialized = true;
        }
    }, []);

    useEffect(() => {
        if (autoCompleteRef.current && props.type) {
            autoCompleteRef.current.setType(props.type);
        }
    }, [props.type])

    useEffect(() => {
        if (autoCompleteRef.current && props.value) {
            autoCompleteRef.current.setValue(props.value);
        }
    }, [props.value])

    useEffect(() => {
        if (autoCompleteRef.current) {
            autoCompleteRef.current.setLimit(props.maxSuggestions || defaultSuggestionCount)
        }
    }, [props.maxSuggestions])

    useEffect(() => {
        if (autoCompleteRef.current && props.onSearchByPhrase) {
            autoCompleteRef.current.setPreprocessHook(props.onSearchByPhrase);
        }
    }, [props.onSearchByPhrase])

    useEffect(() => {
        if (autoCompleteRef.current && props.onPopulateInput) {
            autoCompleteRef.current.setPostprocessHook(props.onPopulateInput);
        }
    }, [props.onPopulateInput])

    useEffect(() => {
        if (autoCompleteRef.current && props.onSuggestionFilter) {
            autoCompleteRef.current.setSuggestionsFilter(props.onSuggestionFilter);
        }
    }, [props.onSuggestionFilter])

    useEffect(() => {
        if (autoCompleteRef.current && props.onLocationSelected) {
            autoCompleteRef.current.on('select', props.onLocationSelected);
        }
    }, [props.onLocationSelected])

    useEffect(() => {
        if (autoCompleteRef.current && props.filterByCountry) {
            autoCompleteRef.current.addFilterByCountry(props.filterByCountry);
        }
    }, [props.filterByCountry])

    useEffect(() => {
        if (autoCompleteRef.current) {
            if (rootElementRef.current) {
                if (props.disabled) {
                    rootElementRef.current.querySelector('.geoapify-autocomplete-input')?.setAttribute('disabled', '');
                } else {
                    rootElementRef.current.querySelector('.geoapify-autocomplete-input')?.removeAttribute('disabled');
                }
            }
        }
    }, [props.disabled])

    return (<>
        <div className={styles.addressAutocomplete} ref={rootElementRef}></div>
    </>);
}

export default AutocompleteAddress;
