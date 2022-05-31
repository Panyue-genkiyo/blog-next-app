import React, {useEffect} from 'react';
import {useQueryClient} from "react-query";
import {useAppSelector} from "../../hooks/redux-hooks";

const SocketClientCBHome = () => {

    const { socket } = useAppSelector(state => state);
    const queryClient = useQueryClient();

    //修改博客 => 及时修改博客所在的页面category
    useEffect(() => {
        if(!socket) return;
        socket.on('upCategoryBlogs', (id: string) => {
           queryClient.invalidateQueries({
               predicate: query => query.queryKey[0] === 'categoryBlogs' && query.queryKey[1] === id
           });
        });
        return () => {
            socket.off('upCategoryBlogs');
        }
    }, [socket, queryClient]);


    return (
        <div>

        </div>
    );
};

export default SocketClientCBHome;
