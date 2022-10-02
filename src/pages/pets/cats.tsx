import type { NextPage } from 'next'
import Header from '@/src/components/Header/Header';

const Cats: NextPage = () => {
    return (
        <>
            <Header />
            <h1>Yo, is this a new page with cats?</h1>
        </>
    );
}

export default Cats;