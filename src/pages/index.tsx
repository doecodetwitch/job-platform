import type { NextPage } from 'next'
import Header from '@/src/components/Header/Header';
import Footer from '@/src/components/Footer/Footer';
import React,{useState} from "react";
import FeaturesContent from "@/src/components/FeaturesContent/FeaturesContent";

const HomePage: NextPage = () => {
const [show,setShow]=useState(true)

    return (
                <>
                    <Header />
                        <div>
                            <div className="relative bg-blue-600 pt-6 sm:py-16">
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                    <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
                                        <h2 className="text-3xl text-white sm:text-4xl md:text-5xl">
                                            Everything you need to run your books.
                                        </h2>
                                        <p className="mt-6 text-lg tracking-tight text-blue-100">
                                            Well everything you need if you aren’t that picky about minor details like tax compliance.
                                        </p>
                                    </div> 
                                </div>
                                <FeaturesContent/>
                            </div>
                        </div>
                    <Footer /> 
                </>
    );
}

export default HomePage;