import { UseQueryResult } from 'react-query';
import dog404 from '@/src/assets/dog404.png';
import dog500 from '@/src/assets/dog500.png';
import Layout from '@/src/components/Layout/Layout';
import styles from '@/src/components/DataPage/DataPage.module.css';
import Spinner from '../Spinner/Spinner';

interface DataPageProps {
    query: UseQueryResult
    children: React.ReactNode
}

const DataPage = ({query, children}: DataPageProps) => {
    if (query.isLoading) {
        return (
            <>
                <Layout>
                    <div className={styles.spinnerWrapper}>
                        <div>
                            <Spinner width={50} height={50}/>
                            <p className={styles.loadingCapition}>Loading...</p>
                        </div>
                    </div>
                </Layout>
            </>
        )
    } else if (query.isError) {
        return (
            <>
                <Layout>
                    <img src={dog500.src} alt="Ooops! Looks like an error has occured :("/>
                </Layout>
            </>
        )
    } else if (!query.data) {
        return (
            <>
                <Layout>
                    <img src={dog404.src} alt="Not found what you are looking for :("/>
                </Layout>
            </>
        );
    } else {
        return (
            <>
                <Layout>
                    {children}
                </Layout>
            </>
        );
    }
    
}

export default DataPage;
