import Header from '@/src/components/Header/Header';
import Footer from '@/src/components/Footer/Footer';

const Layout = (props: any) => {
    return (
        <>
            <Header />
            <div className='layout'>
                {props.children}
            </div>
            <Footer />
        </>
    )
}

export default Layout;
