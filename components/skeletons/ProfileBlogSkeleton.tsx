import React from 'react';
import { Skeleton } from "@mantine/core";
import {useAppSelector} from "../../hooks/redux-hooks";


const ProfileBlogSkeleton = () => {
    const { theme } = useAppSelector(state => state);
    return (
       <>
           {
               Array(3).fill(0).map((_, index) => (
                   <div key={index} className={'mt-2'}>
                       <Skeleton width={'100%'} height={200} className={`${theme && 'skeleton-night'}`}/>
                   </div>
               ))
           }
       </>
    );
};

export default ProfileBlogSkeleton;
