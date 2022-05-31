import React from 'react';
import { Skeleton } from "@mantine/core";
import {useAppSelector} from "../../hooks/redux-hooks";

//category loading骨架屏
const CategorySkeleton = () => {
    const { theme } = useAppSelector(state => state);
    return (
        <div className={`category ${theme && 'category-night'}`}>
                <Skeleton width={50} height={15} style={{ marginLeft: '.2rem' }} className={`${theme && 'skeleton-night'}`}/>
                <div className="d-flex align-items-end justify-content-center" >
                    <Skeleton width={'75%'} height={4} style={{ marginRight: '.2rem' }} className={`${theme && 'skeleton-night'}`}/>
                    <Skeleton width={'20%'} height={30} className={`${theme && 'skeleton-night'}`}/>
                </div>
            <div >
                {
                    Array(3).fill(0).map((_, index) => (
                       <div key={index} className="category_row" style={{ border: 'none' }}>
                           <Skeleton width={'100%'} height={30} className={`${theme && 'skeleton-night'}`}/>
                       </div>
                    ))
                }
            </div>
        </div>
    );
};

export default CategorySkeleton;
