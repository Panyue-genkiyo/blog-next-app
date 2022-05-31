import React, {useEffect, useState} from 'react';
import {useQueryClient} from "react-query";
import {IBlog, IUser} from "../../types/globalTypes";
// import {useLocation} from "react-router-dom";
import {IBlogsUser} from "../../types/rd-types/blogTypes";
import {useAppSelector} from "../../hooks/redux-hooks";
import {useRouter} from "next/router";


const SocketClientProfileHome = () => {

    const queryClient = useQueryClient();
    const { socket } = useAppSelector(state => state);
    const router = useRouter();
    const [page, setPage] = useState( ( router.query.page && +router.query.page ) || 1);
    useEffect(() => {
        if(router.query.page) {
            setPage(+router.query.page);
        }
    }, [router.query.page])

    //更改用户资料及时同时用户查看修改
    useEffect(() => {
        if(!socket) return;
        socket.on('updateUser', async (user: IUser) => {
            // await queryClient.invalidateQueries(['otherUser', user._id]);
            // queryClient.setQueryData(['otherUser', user._id], user);
            queryClient.setQueryData(['otherUser', user._id], user);
        })
    }, [socket, queryClient]);

    //当用户在看的时候,更新用户bog
    useEffect(() => {
        if(!socket) return;
        socket.on('updateBlog', async (blog: IBlog) => {
            let id = typeof blog.user === 'string' ? blog.user : blog.user._id;
            let previousData = queryClient.getQueryData<IBlogsUser>(['userHomeBlogs', id, {limit: 3, page}]);
            if(previousData) {
                let newData = previousData.blogs.map(b => b._id === blog._id ? blog : b) || [blog];
                queryClient.setQueryData(['userHomeBlogs', id, {limit: 3, page}], {
                    blogs: newData,
                    total: previousData.total,
                    id: previousData.id
                })
            }
            if(blog.likes.length > 0){
                console.log(1);
                for (const like of blog.likes) {
                    let id = typeof like === 'string' ? like : like._id;
                    await queryClient.invalidateQueries(['userHomeBlogsLike',id]);
                }
            }
            if(blog.saved.length > 0){
                for (const save of blog.saved) {
                    let id = typeof save === 'string' ? save : save._id;
                    await queryClient.invalidateQueries(['userHomeBlogsSave',id]);
                }
            }
        })
    }, [socket, queryClient])


    //当用户在看的时候,创建用户bog
    useEffect(() => {
        if(!socket) return;
        socket.on('createBlog', async (blog: IBlog) => {
            let id = typeof blog.user === 'string' ? blog.user : blog.user._id;
            await queryClient.invalidateQueries({
                predicate: query => query.queryKey[0] === 'userHomeBlogs'
                    && query.queryKey[1] === id
            });
        })
    }, [socket, queryClient])


    //当用户在看的时候,删除用户bog
    useEffect(() => {
        if(!socket) return;
        socket.on('deleteBlog', async (blog: IBlog) => {
            let id = typeof blog.user === 'string' ? blog.user : blog.user._id;
            await queryClient.invalidateQueries({
                predicate: query => query.queryKey[0] === 'userHomeBlogs'
                    && query.queryKey[1] === id
            });
            if(blog.likes.length > 0){
                for (const like of blog.likes) {
                    let id = typeof like === 'string' ? like : like._id;
                    await queryClient.invalidateQueries(['userHomeBlogsLike',id]);
                }
            }
            if(blog.saved.length > 0){
                for (const save of blog.saved) {
                    let id = typeof save === 'string' ? save : save._id;
                    await queryClient.invalidateQueries(['userHomeBlogsSave',id]);
                }
            }
        })
    }, [socket, queryClient])


    //当用户在看的时候,点赞或者不点赞bog
    useEffect(() => {
        if(!socket) return;
        socket.on('likeUnlikeBlog', async (blog: IBlog) => {
            let id = typeof blog.user === 'string' ? blog.user : blog.user._id;
            await queryClient.invalidateQueries({
                predicate: query => query.queryKey[0] === 'userHomeBlogsLike'
                    && query.queryKey[1] === id
            });
        })
    }, [socket, queryClient]);

    //当用户在看的时候,收藏或者不收藏bog
    useEffect(() => {
        if(!socket) return;
        socket.on('saveUnSaveBlog', async (blog: IBlog) => {
            let id = typeof blog.user === 'string' ? blog.user : blog.user._id;
            await queryClient.invalidateQueries({
                predicate: query => query.queryKey[0] === 'userHomeBlogsSave'
                    && query.queryKey[1] === id
            });
        })
    }, [socket, queryClient]);

    return (
        <div>

        </div>
    );
};

export default SocketClientProfileHome;
