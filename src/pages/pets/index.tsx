import type { NextPage } from 'next'
import Header from '@/src/components/Header/Header';
import { trpc } from "@/src/utils/trpc";

import PetBox from '@/src/components/PetBox/PetBox';
import Footer from '@/src/components/Footer/Footer';

const Pets: NextPage = () => {

    const pets = trpc.useQuery(['pets.getAllPets']);

    if (!pets.data) {
        return (
            <>
                <p>Loading...</p>
            </>
        )
    }

    return (
        <div className='layout'>
            <Header />
            <h1>This will be a list of all pets?</h1>
            <div className='grid gap-x-6 gap-y-6 grid-cols-12'>
                {pets.data?.map((item) => (
                    <div key={item.id} className='col-span-4'>
                        <PetBox pet={item} />
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Pets;