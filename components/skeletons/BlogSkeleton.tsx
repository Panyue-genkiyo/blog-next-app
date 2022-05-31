import React from 'react';
import { Skeleton } from "@mantine/core";
import {useAppSelector} from "../../hooks/redux-hooks";


//blog在loading时展示出来的骨架屏
const BlogSkeleton = () => {
    const { theme } = useAppSelector(state => state);
    return (
        <div>
            <div className='blog-skeleton' style={{ marginTop: '1rem' }}>
                <Skeleton width={120} height={25} className={`${theme && 'skeleton-night'}`}/>
            </div>
            <div className='blog-skeleton-icon-info' style={{ marginTop: '1rem' }}>
                <Skeleton width={200} height={8} className={`${theme && 'skeleton-night'}`}/>
            </div>
            <div className='blog-skeleton-icon-info' style={{ marginTop: '.3rem' }}>
                <Skeleton circle width={25} height={25} className={`${theme && 'skeleton-night'}`} style={{marginRight: '20px'}}/>
                <Skeleton circle width={25} height={25} className={`${theme && 'skeleton-night'}`}/>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <Skeleton width={'100%'} height={'50vh'} className={`${theme && 'skeleton-night'}`}/>
            </div>
        </div>
    );
};

export default BlogSkeleton;
