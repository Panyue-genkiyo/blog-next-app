//分页hook
import {useMemo} from 'react';
import useCustomRouter from "./useCustomRouter";
import { useRouter } from "next/router";

const usePagination = (totalPages: number, callback:any, page: number, sort?: string | string[],  active?: number) => {
    const router = useRouter();
    const {firstArr, lastArr} = useMemo(() => {
        const newArr = [...Array(totalPages)].map((_, i) => i + 1);
        if (totalPages < 4)
            return {
                firstArr: newArr,
                lastArr: []
            }; //当总页数小于4时
        if (!active && totalPages - page >= 4 || active && totalPages - active >= 4 ) {
            return {
                firstArr: !active ? newArr.slice(page - 1, page + 2) : newArr.slice(active - 1, active + 2), //展示前3页
                lastArr: newArr.slice(totalPages - 1)  //展示最后一页
            }
        } else {
            return {
                firstArr: newArr.slice(totalPages - 4, totalPages),
                lastArr: []
            }
        }
    }, [totalPages, page, active]);
    const {pushQuery} = useCustomRouter();

    const isActive = (index: number) => {
        if (!active && index === page) return "active"
        if (active && index === active) return "active"
        return ""
    }

    //上一页
    const prev = () => {
        const newPage = active ? Math.max(active -1 , 1) :  Math.max(page - 1, 1);
        if(!active) {
            let query = sort ? {page: newPage, sort, slug: router.query.slug} : {
                page: newPage,
                slug: router.query.slug
            };
            pushQuery(query);
        }
        callback(newPage);
    }

    //下一页
    const next = () => {
        const newPage = active ? Math.min(active + 1, totalPages) : Math.min(page + 1, totalPages)
        if(!active) {
            let query = sort ? {page: newPage, sort, slug: router.query.slug} : {
                page: newPage,
                slug: router.query.slug
            };
            pushQuery(query); //添加排序
        }
        callback(newPage);
    }

    //跳页
    const jump = (num: number) => {
        if(!active && num === page || active === num) return;
        if(!active) {
            let query = sort ? {page: num, sort, slug: router.query.slug} : {page: num, slug: router.query.slug};
            pushQuery(query);
        }
        callback(num);
    }


    return {firstArr, lastArr, isActive, prev, next, jump}
};

export default usePagination;
