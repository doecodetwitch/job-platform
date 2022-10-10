import styles from './PetBox.module.css';

const PetBox = (pet: any) => {
    return (
        <div className={styles.petBoxContainer}>
            <div className='flex'>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkrOje-pNE1THwtBMK6t9D0Ripx-aKy1xiaw&usqp=CAU" alt="pet-image" className={styles.petBoxImage} />
                <div className={styles.rightNameContainer}>
                    <p className={styles.petName}>{pet.pet.name}</p>
                    <p className={styles.petBreed}>{pet.pet.breed}</p>
                    <p className={styles.petBreed}>7 years, birtday in 273 days</p>
                    {/* TODO get age and count to birthday */}
                </div>
            </div>
            <div>
                <p className={styles.bio}>{pet.pet.bio}</p>
            </div>
        </div>
    );
}

export default PetBox;