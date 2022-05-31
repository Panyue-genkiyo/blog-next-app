import React, {useEffect, useState} from 'react';
import {dehydrate} from "react-query";
import Link from 'next/link';
import Head from 'next/head';
import { Button } from "@mantine/core";
import CardVert from "../components/cards/CardVert";
import NotContent from "../components/global/NotContent";
import {useHomeBlogs} from "../hooks/rq-hooks/useBlogs";
import HomeSkeleton from "../components/skeletons/HomeSkeleton";
import {useAppSelector} from "../hooks/redux-hooks";
import {fetchHomeBlogs} from "../apis/blogsApi";
import {qt} from "./_app";

const Home = () => {
    const { data: homeBlogsData, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useHomeBlogs();
    const { theme, socket } = useAppSelector(state => state);
    const [isSSG, setIsSSG] = useState(true);

    useEffect(() => {
        setIsSSG(false)
    }, [])

    useEffect(() => {
        if(!socket) return;
        socket.emit('joinRoom', 'home');
        return () => {
            socket.emit('leaveRoom', 'home');
        }
    }, [socket])

    if(homeBlogsData?.pages.length === 0) return <NotContent msg={'没有博客'}/>

    return (
        <>
            <Head>
                <title>主页</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='home_page'>
                {
                    isLoading ? <HomeSkeleton /> :
                        !isSSG && homeBlogsData?.pages.map((homeBlog) => (
                            homeBlog.blogs.map(h => (
                                <div key={h._id}>
                                    {
                                        h.count > 0 &&
                                        <>
                                            <h3>
                                                <Link href={`/blogs/${(h.name).toLowerCase()}`} passHref>
                                                    <a className={`${theme && 'home-link-night'}`}>{h.name} <small>({h.count})</small></a>
                                                </Link>
                                            </h3>
                                            <hr className='mt-1'/>
                                            <div className='home_blogs'>
                                                {
                                                    h.blogs.map(blog => (
                                                        <CardVert key={blog._id} blog={blog}/>
                                                    ))
                                                }
                                            </div>
                                        </>
                                    }
                                    {
                                        h.count > 4 &&
                                        <Link href={`/blogs/${h.name}`}>
                                            <a className="text-end d-block my-2 mb-3 text-decoration-none" >查看更多 &gt;&gt;</a>
                                        </Link>
                                    }
                                </div>
                            ))
                        ))
                }
                {
                    !isSSG && hasNextPage && <div className='home_hasMore_button'>
                        <Button
                            variant="gradient" gradient={!theme ? { from: 'teal', to: 'blue', deg: 60 } : {from: '#1e3799', to: '#0a3d62', deg: 60}}
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                            loading={isFetchingNextPage}
                        >
                            {isFetchingNextPage ? '加载中...' : '加载更多'}
                        </Button>
                    </div>
                }
            </div>
        </>

    );
};

export async function getStaticProps(){
    //使用useInfiniteQuery hook提前取出数据
    // const data = qt.getQueryData(['homeBlogs']);
    await qt.prefetchInfiniteQuery(["homeBlogs"],  fetchHomeBlogs, {
        staleTime: Infinity,
        getNextPageParam: (lastPage, _allPages) => {
            if(lastPage.hasMore){
                return lastPage.page + 1;
            }else{
                return undefined;
            }
        }
    });
    return {
        props:{
            dehydratedState:qt && JSON.parse(JSON.stringify(dehydrate(qt)))
        }
    }
}

export default Home;
