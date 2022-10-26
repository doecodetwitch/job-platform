import styles from './PetBox.module.css';

const PetBox = (props: any) => {
    return (
        <div className={styles.petBoxContainer}>
            <div className='flex'>
                {props.pet.image ?
                <img src={process.env.NEXT_PUBLIC_S3_BUCKET_URL + props.pet.image} className={styles.petBoxImage} /> :
                <img src="https://i.pinimg.com/564x/2c/e9/31/2ce931c901ba679c2a855bfd77e6da5f.jpg" alt="pet-image" className={styles.petBoxImage} /> }

                <div className={styles.rightNameContainer}>
                    <p className={styles.petName}>{props.pet.name}</p>
                    <p className={styles.petBreed}>{props.pet.breed}</p>
                    <p className={styles.petBreed}>7 years, birtday in 273 days</p>
                    {/* TODO get age and count to birthday */}
                </div>
            </div>
            <div>
                <p className={styles.bio}>{props.pet.bio}</p>
            </div>
        </div>
    );
}

export default PetBox;