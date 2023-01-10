import styles from './PetBox.module.css';
import Button from 'src/components/Button/Button';
import {useSession} from "next-auth/react";
import add_friend from "@/src/assets/add_friend.svg";
import React from "react";
import { useEffect, useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';

const PetBox = (props: any) => {
    const { data: session } = useSession({ required: true });
    const [days, setDays] = useState(0);
    const [isBirthday, setIsBirthday] = useState(false);

    useEffect(() => {
        const timerId = setInterval(countDown, minute)
        countDown(timerId);
    },[])


    let howOldIsYourDog;

    const birthday:any = new Date(props.pet.born_at)
    const today = new Date();

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = 30.4167;
    const year = day * 365.24;
    
    const diff = today.getTime() - birthday.getTime();
    const yearBirthday = Math.floor(diff / year);
    const days_diff= Math.floor((diff % year) / day);
    const monthBirthday = Math.floor(days_diff / month);
    const dayBirthday = Math.floor(days_diff % month);

    if (yearBirthday > 1){
    howOldIsYourDog = yearBirthday + ' years, ';
    }
    else if (yearBirthday == 1) {
        howOldIsYourDog = yearBirthday + ' year, ';
    }
    else {
        if(monthBirthday > 1 ){
            howOldIsYourDog = monthBirthday + ' months, ';
        }
        else if(monthBirthday == 1){
            howOldIsYourDog = monthBirthday + ' month, ';
        }
        else{
            if(dayBirthday > 1){
                howOldIsYourDog = dayBirthday + ' days, ';
            }
            else if (dayBirthday == 1){
                howOldIsYourDog = dayBirthday + ' day, ';
            }
            else (
                howOldIsYourDog = ''
            )
        }
    }

    
    function countDown(timerId:any) {
        const today:any = new Date();
        const timeSpan:any = birthday - today;
        
        if (timeSpan <= -day) {
            clearInterval(timerId);
            const daysToMultiply = Math.floor(timeSpan / day);
            const yearsToAdd = (Math.floor((daysToMultiply*-1) / 365)) + 1;
            const finalDays:any = (yearsToAdd*365) + daysToMultiply;
            setDays(finalDays);
            return;
        }
        else if (timeSpan <= 0) {
            setIsBirthday(true);
            clearInterval(timerId);
            return;
        }
        else {
            setDays(Math.floor(timeSpan / day));

        }
    }


    return (
        <div className={styles.petBoxContainer}>
            <div className='flex'>
                {props.pet.image ?
                <img src={process.env.NEXT_PUBLIC_S3_BUCKET_URL + props.pet.image} className={styles.petBoxImage} /> :
                <img src="https://i.pinimg.com/564x/2c/e9/31/2ce931c901ba679c2a855bfd77e6da5f.jpg" alt="pet-image" className={styles.petBoxImage} /> }

                <div className={styles.rightNameContainer}>
                    <div className='flex'>
                        <p className={styles.petName}>{props.pet.name}</p>
                        {props.mode === 'petListing' ?
                        
                            <div className='self-center ml-2 cursor-pointer'>
                                <FiUserPlus onClick={()=>props.sendFriendRequestMutation.mutate({senderId: session?.user?.id, receiverId: props.pet.userId})}/>
                            </div>
                         :
                        null}
                    </div>
                    <p className={styles.petBreed}>{props.pet.breed}</p>
                    
                    <p className={isBirthday ? styles.petBirthday : styles.petCounterBirthday}>{isBirthday ? 'Happy Birthday!' : howOldIsYourDog + 'birthday in ' + days + (days == 1 ? ' day' : ' days')}</p>
                </div>
            </div>
            <div>
                <p className={styles.bio}>{props.pet.bio}</p>
            </div>
        </div>
    );
}

export default PetBox;