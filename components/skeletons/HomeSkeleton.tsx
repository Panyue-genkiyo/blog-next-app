import React from 'react';
import { Skeleton } from '@mantine/core'
import {useAppSelector} from "../../hooks/redux-hooks";

const HomeSkeleton = () => {
    const { theme } = useAppSelector(state => state);
    return (
        <>
            {
                Array(3).fill(0).map((_, index) => (
                    <div key={index} className={'mt-2'}>
                        <Skeleton width='20%' height={25} className={`${theme && 'skeleton-night'}`}/>
                        <Skeleton height={8} radius='xl' className={`mt-2 ${theme && 'skeleton-night'}`}/>
                        <div className={'home_blogs'}>
                            <Skeleton height={200} width='100%' className={`mt-2 ${theme && 'skeleton-night'}`}/>
                        </div>
                    </div>
                ))
            }
        </>
    );
};

export default HomeSkeleton;
