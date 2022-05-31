import React, {useEffect, useState} from 'react';
import { useRouter } from "next/router";
import usePagination from "../../hooks/util-hooks/usePagination";
import {useAppSelector} from "../../hooks/redux-hooks";

interface IProps{
    total: number,
    callback: (num : number) => void,
    active?: number,
}

const Pagination: React.FC<IProps> = ({ total, callback, active }) => {

    const router =  useRouter();
    const [page, setPage] = useState(+(router.query.page || 1));
    const [sort, setSort] = useState(router.query.sort);
    const { theme } = useAppSelector(state => state);
    const { prev, next, jump, firstArr, lastArr, isActive } = usePagination(total, callback, page, sort, active);

    useEffect(() => {
        if(!router.query.page && !router.query.sort) return;
        if(router.query.page) setPage(+(router.query.page as string));
        if(router.query.sort) setSort(router.query.sort);
        return () => {
            setPage(1);
        }
    }, [router.query.page, router.query.sort])



    return (
        <div className={`pagination ${theme && 'pagination-night'}`}>
            {(!active && page > 1 || active && active > 1) && <button onClick={prev}>&laquo;</button>}
            {
                firstArr.map(num => (
                    <button onClick={() => jump(num)} key={num} className={`${isActive(num)}`}>
                        {num}
                    </button>
                ))
            }
            {lastArr.length > 0 && <button>...</button>}
            {
                lastArr.map(num => (
                    <button onClick={() => jump(num)} key={num} className={`${isActive(num)}`}>
                        {num}
                    </button>
                ))
            }
            {(!active && page < total || active && active < total) && <button onClick={next}>&raquo;</button>}
        </div>
    );
};

export default React.memo(Pagination);
