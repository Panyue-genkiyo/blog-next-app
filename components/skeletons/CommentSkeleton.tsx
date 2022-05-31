import React from 'react';
import {Skeleton} from "@mantine/core";
import {useAppSelector} from "../../hooks/redux-hooks";

//comment在loading时展示骨架屏
const CommentSkeleton = () => {
    const { theme } = useAppSelector(state => state);
    return (
        <>
            <div style={{ marginTop: '.8rem' }}>
                <Skeleton width={'100%'} height={4} className={`${theme && 'skeleton-night'}`}/>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <Skeleton width={'100%'} height={80} className={`${theme && 'skeleton-night'}`}/>
                <div style={{ display: 'flex', justifyContent:'end', marginTop: '.2rem', marginBottom: '.5rem' }}>
                    <Skeleton width={120} height={30} className={`${theme && 'skeleton-night'}`}/>
                </div>
            </div>
            {
                Array(3).fill(0).map((_, index) => (
                    <div key={index} style={{ width: '100%', display: 'flex', marginTop: '.8rem', padding: '.8rem' }}>
                        <div style={{ maxWidth: '10%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '0.8rem' }}>
                            <Skeleton circle width={'100%'} height={30} style={{ marginBottom: '.2rem' }} className={`${theme && 'skeleton-night'}`}/>
                            <Skeleton height={10} className={`${theme && 'skeleton-night'}`}/>
                        </div>
                        <div style={{minWidth: '90%'}}>
                            <Skeleton width={'100%'} height={70} className={`${theme && 'skeleton-night'}`}/>
                        </div>
                    </div>
                ))
            }
        </>
    );
};

export default CommentSkeleton;
