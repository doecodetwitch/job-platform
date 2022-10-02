import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Header from '@/src/components/Header/Header';

const Account: NextPage = () => {
    const { data: session } = useSession({required: true});
    return (
        <div>
            <Header />
            <h1>This is your account!</h1>
        </div>
    );
}

export default Account;