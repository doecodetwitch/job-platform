import type { NextPage } from 'next';
import {trpc} from "@/src/utils/trpc";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer/Footer";
import Button from "@/src/components/Button/Button";
import ServiceForm from '@/src/components/Service/ServiceForm';
import { useSession } from "next-auth/react";
import {useState} from "react";
import { useTranslation } from 'next-i18next'
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import nextI18nConfig from "src/../next-i18next.config.mjs";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
            "en",
            "pl",
        ])),
    },
});


const Services: NextPage = () => {
    const { t } = useTranslation("common");
    const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
    const { data: session } = useSession({ required: true });

    const {data: workingAccount, isLoading} = trpc.useQuery(['account.getMyWorkingAccount']);

    const startProvidingServicesMutation = trpc.useMutation("account.setupWorkingAccount", {
        onSuccess: () => {
            window.location.reload();
            console.log('success!')
        },
        onError: (error) => {
            console.log('Error occured, ', error.message)
        }
    })

    const handleStartProvidingServices = () => {
        startProvidingServicesMutation.mutate();
    }

    const handleToggleServiceForm = () => {
        setIsServiceFormOpen(!isServiceFormOpen);
    }

    return (
        <>
            <div className='layout'>
                <Header />

                <h2 className='font-display text-3xl tracking-tight sm:text-4xl md:text-4xl'>{t("accountServices.title")}</h2>
                <p>{t("accountServices.description")}</p>

                {workingAccount || isLoading ? null :
                <Button onClick={()=>handleStartProvidingServices()} priority='high'>
                    Start providing services!
                </Button> }

                { workingAccount?.services.length === 0 ?
                <Button onClick={()=>handleToggleServiceForm()} priority='mid'>
                    Add your first service!
                </Button> :
                <div>
                    {workingAccount?.services.map((service)=>(
                        <div key={service.id}>
                            {service.name}
                        </div>
                    ))}

                    <Button priority='high' onClick={()=>handleToggleServiceForm()}>New service</Button>
                </div> }

                {isServiceFormOpen ?
                <ServiceForm
                    handleToggleServiceForm={handleToggleServiceForm}
                    workingAccountId={workingAccount?.id}
                /> :
                null }

                <Footer />
            </div>
        </>
    );
}

export default Services;