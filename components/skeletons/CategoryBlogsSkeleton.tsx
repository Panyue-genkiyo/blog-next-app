import React from 'react';
import { Skeleton } from "@mantine/core";
import {useAppSelector} from "../../hooks/redux-hooks";

const CategoryBlogsSkeleton = () => {
    const { theme } = useAppSelector(state => state);
    return (
        <div className='blogs_category'>
            <Skeleton width={'3%'} height={12} style={{ marginTop: '.5rem' }} className={`${theme && 'skeleton-night'}`}/>
            <Skeleton height={40} width={'30%'} style={{ marginTop: '.3rem' }} className={`${theme && 'skeleton-night'}`}/>
            <div className='show_blogs mt-2'>
                {
                    Array(3).fill(0).map((_, index) => (
                        <Skeleton key={index} width={'100%'} height={200} className={`${theme && 'skeleton-night'}`}/>
                    ))
                }
            </div>
        </div>
    );
};

export default CategoryBlogsSkeleton;
