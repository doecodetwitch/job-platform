import React from 'react';
import price_tag from '@/src/assets/price_tag.svg';
import Button from '../Button/Button';

const JobListItem = ({job}: any) => {
    return (
        <>
            <div className='bg-brand-white m-4 cursor-pointer'>
                <div className='w-full p-4'>
                    <p className='my-4'>{job.title}</p>
                    <p className="text-xs">{job.description}</p>
                    <p className='flex items-center mt-6 justify-end'>
                        <div className='grow'>
                            <Button priority='lower'>
                                See more
                            </Button>
                        </div>
                        <img src={price_tag.src} alt="Price" width='30' />
                        <p className='mr-2'>{job.price}</p>
                    </p>
                </div>
            </div>
        </>
    );
}

export default JobListItem;