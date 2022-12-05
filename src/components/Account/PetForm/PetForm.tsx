import { trpc } from "@/src/utils/trpc"
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import axios from 'axios';
import Button from '@/src/components/Button/Button';
import styles from "@/src/components/Account/PetForm/PetForm.module.css"

const PetForm = (props: any) => {
    const { register: registerNewPet, handleSubmit: handleSubmitNewPet, formState: { errors: errorsNewPet } } = useForm();

    const addPetMutation = trpc.useMutation('account.addPet', {
        onSuccess: () => {
            window.location.reload()
            console.log('success')
        },
        onError: (error) => {
            console.log(`Something went wrong: ${error.message}`)
        },
    })

    const { data: petTypes } = trpc.useQuery(['pets.getPetTypes']);
    const [petType, setPetType] = useState('Dog');
    const [breedList, setBreedList] = useState<string[]>([]);

    useEffect(() => {
        const chosenPetType = petTypes?.find(o => o.name === petType);
        const Arr = chosenPetType?.breeds?.split(',');
        if (Arr) {
            setBreedList(Arr);
        }
    }, [petType, petTypes])

    const onChangePetType = (e: any) => {
        setPetType(e.target.value);
    }

    const { mutateAsync: getS3FileUploadUrl } = trpc.useMutation('account.getS3UrlPromise');
    const onCreatePetSubmit = async (data: any) => {
        const s3FileUploadUrl = await getS3FileUploadUrl({ name: data.petImage[0].name, type: data.petImage[0].type });
        await axios.put(s3FileUploadUrl, data.petImage[0], {
            headers: {
                "Content-type": data.petImage[0].type,
                "Access-Control-Allow-Origin": "*",
            }
        }).then(() => {
            addPetMutation.mutate({
                name: data.petName,
                type: data.type,
                breed: data.breed,
                bio: data.bio,
                born_at: selectedDay.toISOString(),
                image: data.petImage[0].name
            })
        });
    }

    //presets for the datePicker -> dog's age
    const today: Date = new Date();
    const [selectedDay, setSelectedDay] = useState<any>(today);

    return (
        <div className={styles.petFormContainer}>
            <span className={styles.petFormTitle}>
                <h3 className='grow'>Add your lovely pet!</h3>
                <Button onClick={() => { props.closePetForm() }} priority='high'>Close</Button>
            </span>
            <form onSubmit={handleSubmitNewPet(onCreatePetSubmit)}>
                <div className="inputContainer">
                    <input placeholder='Name of your pet' {...registerNewPet('petName', { required: true })} className='input' />
                    {errorsNewPet.petName && <span className={styles.petFormError}>This field is required</span>}
                </div>
                <div className="inputContainer">
                    <input type='file' placeholder='Name of your pet' {...registerNewPet('petImage', { required: true })} className='input' />
                    {errorsNewPet.petImage && <span className={styles.petFormError}>This field is required</span>}
                </div>
                {/* TODO load available pet types from db */}
                <div className="inputContainer">
                    <select placeholder='Type of your pet' {...registerNewPet("type", { required: true })} className='input' onChange={(e) => onChangePetType(e)} >
                        {petTypes?.map((petType) => (
                            <option key={petType.name} value={petType.name}>
                                {petType.name}
                            </option>
                        ))}
                    </select>
                    {errorsNewPet.type && <span className={styles.petFormError}>This field is required</span>}
                </div>
                <div className="inputContainer">
                    <select placeholder='Breed of your pet' {...registerNewPet('breed', { required: true })} className='input'>
                        {breedList?.map((breed) => (
                            <option key={breed} value={breed}>{breed}</option>
                        ))}
                    </select>
                    {errorsNewPet.breed && <span className={styles.petFormError}>This field is required</span>}
                </div>
                <div className="inputContainer">
                    <textarea placeholder='Bio.. write something about your pet' {...registerNewPet('bio', { required: false })} className='input' />
                </div>
                <div className="inputContainer">
                    <DayPicker
                        fromYear={2005}
                        toYear={2022}
                        captionLayout="dropdown"
                        mode="single"
                        required
                        selected={selectedDay}
                        onSelect={setSelectedDay}
                    />
                </div>
                <Button priority="mid">Add a pet</Button>
            </form>
        </div>
    );
}

export default PetForm