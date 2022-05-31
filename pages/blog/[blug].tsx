import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from "next/router";
import {useBlogs} from "../../hooks/rq-hooks/useBlogs";
import DisplayBlog from "../../components/blog/DisplayBlog";
import NotFound from "../../components/global/NotFound";
import useDeleteDispose from "../../hooks/util-hooks/useDeleteDispose";
import BlogSkeleton from "../../components/skeletons/BlogSkeleton";
import {useAppSelector} from "../../hooks/redux-hooks";
import {NextPageContext} from "next";
import {dehydrate} from "react-query";
import {fetchBlog} from "../../apis/blogsApi";
import {fetchComments} from "../../apis/commentsApi";
// import qt from "../../hooks/rq-hooks/useQueryClientMy";
import {qt} from "../_app";

const DetailBlog = () => {

    const router = useRouter();
    const id = router.query.blug;
    const [showChild, setShowChild] = useState(false)
    const { socket } = useAppSelector(state => state);
    const { isError, isLoading, data: blog } = useBlogs(id as (undefined | string));

    useDeleteDispose(isError, id as (string | undefined));

    //socket io
    useEffect(() => {
        if(!id || !socket) return;
        socket.emit('joinRoom', id);
        socket.emit('joinRoom', 'home')
        return () => {
            socket.emit('leaveRoom', id);
            socket.emit('leaveRoom', 'home');
        }
    }, [socket, id]);

    useEffect(() => {
        setShowChild(true);
    }, [])

    if(!id || !showChild) return null;

    if(isLoading) return <BlogSkeleton/>

    if(isError) return <NotFound/>


    return (
        <>
            <Head>
                <title>{blog.title}</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='my-4'>
                <DisplayBlog blog={blog}/>
            </div>
        </>
    );
};

// export async function getServerSideProps(context: NextPageContext){
//     const bd = qt?.getQueryData(['blog', context.query.blug]);
//     const cd = qt?.getQueryData(['comments', { id: context.query.blug, limit: 4, page: 1 }])
//     if(!bd && !cd){
//         await qt?.prefetchQuery(['blog', context.query.blug],
//             () => fetchBlog(context.query.blug as string)
//         )
//         await qt?.prefetchQuery(['comments', {
//             id: context.query.blug,
//             limit: 4,
//             page: 1
//         }], () => fetchComments(context.query.blug as string));
//     }
//     return {
//         props:  {
//             dehydratedState: qt && JSON.parse(JSON.stringify(dehydrate(qt)))
//         }
//     }
// }

export default DetailBlog;