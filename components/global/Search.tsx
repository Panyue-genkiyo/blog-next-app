import React, { useState, useEffect } from 'react';
import {useQueryClient} from "react-query";
import {useClickOutside} from '@mantine/hooks'
import CardHoriz from "../cards/CardHoriz";
import NotContent from "./NotContent";
import Loading from "./Loading";
import {useSearchBlogs} from "../../hooks/rq-hooks/useBlogs"


const Search = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [flag, setFlag] = useState(false);
    const [open, setOpen] = useState(false);
    const ref = useClickOutside(() => {
        setOpen(false);
        setSearch('');
    });
    const {data: searchBlogs, isFetching, isRefetching} = useSearchBlogs(search, flag);

    useEffect(()=> {
        const delayDebounce = setTimeout(async () => {
            setFlag(true); //设置是否请求字段flag 节流
        }, 400);

        return () => {
            clearTimeout(delayDebounce);
            setFlag(false);
            queryClient.removeQueries(['search', search]);
        }
    }, [search]);


    return (
        <div className="search w-100 position-relative me-4 s-interact" onClick={() => setOpen(true)} ref={ref}>
            <input type="text" className="form-control me-2 w-100"
                   value={search} placeholder="输入关键字搜索blog"
                   onChange={e => setSearch(e.target.value)}  />

            {
                open && search.length >= 2 &&
                <div className="position-absolute pt-2 px-1 w-100 rounded search-result"
                     style={{
                         background: '#eee',
                         maxHeight: 'calc(100vh - 100px)',
                         zIndex:10,
                         overflow: 'auto'
                }}>
                    {
                        ((isFetching && !searchBlogs) || isRefetching) ? <Loading/>
                            : (!isFetching && !searchBlogs?.length) ?
                                <NotContent msg={'没找到与之相关的博客...'}/>
                                : searchBlogs?.map(blog => (
                            <CardHoriz blog={blog} key={blog._id} name='search' setOpen={setOpen} setSearch={setSearch}/>
                        ))
                    }
                </div>
            }
        </div>
    );
};

export default Search;
