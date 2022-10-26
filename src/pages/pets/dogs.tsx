import type { NextPage } from 'next'
import Header from '@/src/components/Header/Header';

const Dogs: NextPage = () => {
    return (
        <div className='layout'>
            <Header />
            
            <h1>Yo, is this a new page?</h1>
        </div>
    );
}

export default Dogs;