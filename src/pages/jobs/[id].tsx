import type { NextPage } from 'next'
import { trpc } from "@/src/utils/trpc";
import { useRouter } from 'next/router';
import DataPage from '@/src/components/DataPage/DataPage';
import { isString, isUndefined } from "is-what";
import styles from '@/src/styles/jobs/id.module.css'

const Jobs: NextPage = () => {
    const router = useRouter();
    if (isUndefined(router.query.id) || !isString(router.query.id)) {
        return (<>
            <h1>This job no longer exist.</h1>
        </>)
    }
    const query = trpc.useQuery(['jobs.getJobById', { id: router.query.id }]);

    const jobStatus = query.data?.status ? "Aktualne" : "Nieaktualne"

    return (
        <DataPage query={query}>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <img src='https://i.pinimg.com/564x/2c/e9/31/2ce931c901ba679c2a855bfd77e6da5f.jpg' alt="piesobrazek" className={styles.petImage} />
                    <p className={styles.dogName}>{query.data?.pet.name}</p>
                    <p className={styles.jobTitle}>{query.data?.title}</p>
                    <div className={styles.priceStatusContainer}>
                        <p className={styles.jobPrice}>{query.data?.price}zł</p>
                        <p className={styles.jobStatus}>{jobStatus}</p>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <h1 className={styles.descriptionTitle}>Opis:</h1>
                    <p className={styles.jobDescription}>{query.data?.description}</p>
                    <div className={styles.contactContainer}>
                        <p className={styles.contact}>e-mail:</p><p className={styles.contactData}>{query.data?.contactEmail}</p>
                        <p className={styles.contact}>tel:</p><p className={styles.contactData}>{query.data?.contactNumber}</p>
                    </div>
                </div>
            </div>
        </DataPage>
    )
}

export default Jobs;