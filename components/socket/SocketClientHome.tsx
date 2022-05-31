import React, {useEffect} from 'react';
import {useQueryClient} from "react-query";
import {useAppSelector} from "../../hooks/redux-hooks";

const SocketClientHome = () => {
    const { socket } = useAppSelector(state => state);
    const queryClient = useQueryClient();

    useEffect(() => {
        if(!socket) return;
        socket.on('getNewHomeBlogs', () => {
            queryClient.invalidateQueries(['homeBlogs']);
        });
        return () => {
            socket.off('getNewHomeBlogs');
        }
    }, [socket, queryClient])

    //修改用户信息及时更新 categoryBlog
    useEffect(() => {
        if(!socket) return;
        socket.on('getNewUserInfoInCategoryBlog', () => {
            queryClient.invalidateQueries(['categoryBlogs']);
        });
        return () => {
            socket.off('getNewUserInfoInCategoryBlog');
        }
    }, [socket, queryClient])


    useEffect(() => {
        if(!socket) return;
        socket.on('getNewBlog', () => {
            queryClient.invalidateQueries(['blog']);
        });
        return () => {
            socket.off('getNewBlog');
        }
    }, [socket, queryClient])

    useEffect(() => {
        if(!socket) return;
        socket.on('getNewComment', () => {
            queryClient.invalidateQueries(['comments']);
        });
        return () => {
            socket.off('getNewComment');
        }
    }, [socket, queryClient])


    return (
        <div>

        </div>
    );
};

export default SocketClientHome;
