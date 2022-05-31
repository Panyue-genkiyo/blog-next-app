import React, { useEffect, useState } from 'react';
import {useQueryClient} from "react-query";
import {IBlog, IComment} from '../../types/globalTypes'
import {ICommentState} from "../../types/rq-types/commentTypes";
// import {useLocation} from "react-router-dom";
import { useRouter } from "next/router";
import {useAppSelector} from "../../hooks/redux-hooks";

const SocketClient = () => {

    const { socket } = useAppSelector(state => state);
    const queryClient = useQueryClient();
    const router = useRouter();
    const [page, setPage] = useState( ( router.query.page && +router.query.page ) || 1);
    useEffect(() => {
        if(router.query.page) {
            setPage(+router.query.page);
        }
    }, [router.query.page])

    //create Comment
    useEffect(() => {
        if(!socket) return;
        //是查询失效
        socket.on('comment', (id: string) => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'comments' && (query.queryKey[1] as any).id === id
            });
        })
        return () => {
            socket.off('comment');
        }
    }, [socket, queryClient])

    //update comment
    useEffect(() => {
        if(!socket) return;
        socket.on('updateComment', async (comment: IComment) => {
            await queryClient.cancelQueries(['comments', {id: comment.blog_id, limit: 4, page}]);
            const prevComments = await queryClient.getQueryData<ICommentState>(['comments', {id: comment.blog_id, limit: 4, page}]);
            if (prevComments) {
                if(!comment.comment_root){
                    const newComments = prevComments.comments.map(item => {
                        if (item._id === comment._id) {
                            return comment;
                        }
                        return item;
                    });
                    queryClient.setQueryData(['comments', {id: comment.blog_id, limit: 4, page}], {comments: newComments, total: prevComments.total});
                }else{
                    const newComments = prevComments.comments.map(c => {
                        if (c._id === comment.comment_root) {
                            c.replyCM = c.replyCM?.map(rc => rc._id === comment._id ? comment : rc);
                            return c;
                        }
                        return c;
                    });
                    queryClient.setQueryData(['comments', {id: comment.blog_id, limit: 4, page}], {comments: newComments, total: prevComments.total});
                }
            }
        })
        return () => {
            socket.off('updateComment');
        }
    }, [socket, queryClient, page])

    //reply comment
    useEffect(() => {
        if(!socket) return;
        socket.on('replyComment', async (comment: IComment) => {
            await queryClient.cancelQueries(['comments', {id:comment.blog_id, limit:4, page}]);
            const prevComments = await queryClient.getQueryData<ICommentState>(['comments', {id: comment.blog_id, limit: 4, page}]);
            if(prevComments) {
                const newComments = prevComments.comments.map(c => {
                    if (c._id === comment.comment_root) {
                        c.replyCM?.push(comment);
                        return c;
                    }
                    return c;
                });
                queryClient.setQueryData(['comments', {id: comment.blog_id, limit: 4, page}], {
                    comments: newComments,
                    total: prevComments.total
                });
            }
        })
        return () => {
            socket.off('updateComment');
        }
    }, [socket, queryClient, page])

    //blog like unLike
    useEffect(() => {
      if(!socket) return;
      socket.on('blogLikeUnLike', async (blog: IBlog) => {
          await queryClient.cancelQueries(['blog', blog._id]);
          queryClient.setQueryData(['blog', blog._id], blog);
      });
    }, [queryClient, socket])

    //blog save unSave
    useEffect(() => {
        if(!socket) return;
        socket.on('blogSaveUnSave', async (blog: IBlog) => {
            await queryClient.cancelQueries(['blog', blog._id]);
            queryClient.setQueryData(['blog', blog._id], blog);
        });
    }, [queryClient, socket])


    //blog content
    useEffect(() => {
        if(!socket) return;
        socket.on('updateBlog', async (blog: IBlog) => {
            await queryClient.cancelQueries(['blog', blog._id]);
            queryClient.setQueryData(['blog', blog._id], blog);
        })
    }, [queryClient, socket])

    //delete Blog
    useEffect(() => {
        if(!socket) return;
        socket.on('deleteBlog', async (blog: IBlog) => {
            queryClient.invalidateQueries(['blog', blog._id]);
        });
    }, [queryClient, socket])

    return (
        <div>

        </div>
    );
};

export default SocketClient;
