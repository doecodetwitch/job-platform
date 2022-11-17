import type { NextPage } from 'next'
import Header from '@/src/components/Header/Header';
import Footer from '@/src/components/Footer/Footer';
import React,{useEffect, useState, useRef} from "react";
import FeaturesContent from "@/src/components/FeaturesContent/FeaturesContent";
import styles from "@/src/styles/homepage/index.module.css"

const HomePage: NextPage = () => {

const [dogImage, setDogImage] = useState([])

    const featuresSection = useRef (null);
    const scrollToSection = (elementRef:any) => {
        window.scrollTo({
            top: elementRef.current.offsetTop,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        fetch("https://dog.ceo/api/breeds/image/random/6")
            .then(res => res.json())
            .then(data => setDogImage(data.message))
    }, [])

    return (
                <>
                    <Header />
                        <div className={styles.main}>
                            <h1 className={styles.titleText}>Guam viverra orci <span className="text-blue-600">Doggosy</span> eu volutpat  facilisis</h1>
                            <p className={styles.descriptionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <div className={styles.buttonDiv}>
                                <a className={styles.button} onClick={() => scrollToSection(featuresSection)}>Features</a>
                                <a className={styles.button} href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Watch video</a>
                            </div>
                            <div className={styles.imagesDiv}>
                                {dogImage.map((item, index) => (
                                    <img className={styles.image} src={item} key={index} />
                                ))}
                            </div>
                        </div>
                        <div ref={featuresSection}>
                            <div className={styles.featuresSection}>
                                <div className={styles.featuresHeader}>
                                    <div className={styles.featuresText}>
                                        <h2 className={styles.featuresTitle}>
                                            Everything you need to run your books.
                                        </h2>
                                        <p className={styles.featuresContent}>
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
