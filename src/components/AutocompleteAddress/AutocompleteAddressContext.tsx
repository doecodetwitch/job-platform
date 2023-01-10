import { createContext} from 'react';

export interface AutocompleteAddressContextProps {
    apiKey: string;
    children: React.ReactNode
}

export const AutocompleteAddressCtx = createContext<string>('');

const AutocompleteAddressContext = (props: AutocompleteAddressContextProps) => {

    return (<>
        <AutocompleteAddressCtx.Provider value={props.apiKey}>
            {props.children}
        </AutocompleteAddressCtx.Provider>
    </>);
}

export default AutocompleteAddressContext;
