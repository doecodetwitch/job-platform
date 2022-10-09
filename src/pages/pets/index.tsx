import type { NextPage } from 'next'
import Header from '@/src/components/Header/Header';
import { trpc } from "@/src/utils/trpc";

const Pets: NextPage = () => {

    const pets = trpc.useQuery(['pets.getAllPets']);

    if(!pets.data){
        return (
            <>
                <p>Loading...</p>
            </>
        )
    }

    return (
        <>
            <Header />
            <h1>This will be a list of all pets?</h1>
            {pets.data?.map((pet)=>(
                <div key={pet.id}>
                    {pet.name}
                </div>
            ))}
        </>
    );
}

export default Pets;