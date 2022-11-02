import Header from "@/src/components/Header/Header"
import Footer from "@/src/components/Footer/Footer"
import { useEffect, useState } from "react"
import styles from "./index.module.css"

const Title = () => {

    const [dogImage, setDogImage] = useState([])

    useEffect(() => {
        fetch("https://dog.ceo/api/breeds/image/random/6")
            .then(res => res.json())
            .then(data => setDogImage(data.message))
    }, [])

    return (
        <div>
            <Header />
            <div className={styles.main}>
                <h1 className={styles.titleText}>Guam viverra orci <span className="text-blue-600">Doggosy</span> eu volutpat  facilisis</h1>
                <p className={styles.descriptionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className={styles.buttonDiv}>
                    <a className={styles.button} href="#">Features</a>
                    <a className={styles.button} href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Watch video</a>
                </div>
                <div className={styles.imagesDiv}>
                    {dogImage.map((item, index) => (
                        <img className={styles.image} src={item} key={index} />
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Title 