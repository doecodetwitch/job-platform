import React, {useState} from 'react';
import price_tag from '@/src/assets/price_tag.svg';
import Button from '../Button/Button';
import AccountJobDetail from "@/src/components/Account/AccountJobDetail/AccountJobDetail";
import Link from 'next/link'

const JobListItem = ({job, mode}: any) => {
    const [editMode, setEditMode] = useState(false);
    const handleCloseEdit = () => {
        setEditMode(false);
    }

    return (
        <>
            <div className='bg-brand-white m-4 cursor-pointer'>
                <div className='w-full p-4'>
                    <p className='my-4'>{job.title}</p>
                    <p className="text-xs">{job.description}</p>
                    <div className='flex items-center mt-6 justify-end'>
                        <div className='grow flex space-x-2 items-center'>
                            <Button priority='lower'>
                               <Link href={`/jobs/${encodeURIComponent(job.id)}`}>See More</Link>
                            </Button>
                            {mode === 'myAccount' &&
                                <>
                                    <Button priority='lower' onClick={() => (setEditMode(true))}>
                                        Edit
                                    </Button>
                                </>
                            }
                        </div>
                        <img src={price_tag.src} alt="Price" width='30' />
                        <p className='mr-2'>{job.price}</p>
                    </div>
                </div>
            </div>
            {editMode && <AccountJobDetail job={job} closeEdit={handleCloseEdit} />}
        </>
    );
}

export default JobListItem;