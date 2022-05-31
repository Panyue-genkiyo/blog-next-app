import React, {useEffect, useState, ReactNode} from 'react';
// import {useNavigate, useParams} from "react-router-dom";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import {IComment,IUser, IBlog} from "../../types/globalTypes";
import Input from "./Input";
import {useDeleteCommentMutation, useReplyCommentMutation, useUpdateCommentMutation} from "../../hooks/rq-hooks/useComments";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";

interface IProp {
  comment: IComment;
  showReply: IComment[];
  setShowReply: (comment: IComment[]) => void;
  children?: ReactNode
}

const CommentList: React.FC<IProp> = ({ comment, setShowReply, showReply, children }) => {
    const router  = useRouter();
    const [onReply, setOnReply] = useState(false);
    const [ edit, setEdit ] = useState<IComment>();
    const { auth, userLocation } = useAppSelector(state => state);
    const dispatch = useAppDispatch();
    // const navigate = useNavigate();
    const queryClient = useQueryClient();
    const commentsPage = userLocation['comments'][comment.blog_id] ? userLocation['comments'][comment.blog_id] : 1;
    const limit = 4;
    const blog = queryClient.getQueryData<IBlog>(['blog', router.query.slug]);
    const { mutate: updateCommentMutate } = useUpdateCommentMutation();
    const { mutate: deleteCommentMutate } = useDeleteCommentMutation();
    const { mutate: addCommentReplyMutate } = useReplyCommentMutation();


    const handleReply = (body: string) => {
        if(!auth.user || !auth.access_token) return;
        const data = {
            content: body,
            user: auth.user,
            blog_id: comment.blog_id,
            blog_user_id: (blog?.user as IUser)._id ,
            reply_user:  comment.user,
            comment_root: comment.comment_root || comment._id,
            createdAt: new Date().toISOString(),
        }
        setShowReply([data, ...showReply]);
        addCommentReplyMutate({
            comment: data,
            dispatch,
            id: blog?._id,
            page: commentsPage,
            limit,
            token: auth.access_token
        })
        setOnReply(false);
    }

    const handleUpdate = (body: string) => {
        if(!auth.user || !auth.access_token || !edit) return;
        if(body === edit.content) setEdit(undefined);
        const newComment = {
            ...edit,
            content: body,
        }
        updateCommentMutate({
            comment: newComment,
            page: commentsPage,
            limit,
            dispatch,
            id: blog?._id,
            token: auth.access_token,
            router
        })
        setEdit(undefined);
    }

    const handleDelete = (comment: IComment) => {
        if(!auth.user || !auth.access_token) return;
        deleteCommentMutate({
            comment,
            page: commentsPage,
            limit,
            dispatch,
            id: blog?._id,
            token: auth.access_token,
            router
        })
    }

    useEffect(() => {
        if(onReply) setOnReply(false);
        if(edit) setEdit(undefined);
    }, [commentsPage])

    const Nav = (comment: IComment) => {
        return (
            <div>
                <i className='fas fa-edit me-2' onClick={() => setEdit(comment)}/>
                <i className='fas fa-trash-alt mx-2 text-danger' onClick={() => handleDelete(comment)}/>
            </div>
        )
    }

    return (
        <div className='w-100'>
            {
                edit ? <Input callback={handleUpdate} edit={edit} setEdit={setEdit}/>
                     : (
                        <div className="comment_box">
                            <div className='p-2' dangerouslySetInnerHTML={{
                                __html: comment.content
                            }}/>

                            <div className='d-flex justify-content-between p-2'>
                                {
                                    auth.user && (
                                        <small style={{ cursor: 'pointer' }} onClick={() => setOnReply(!onReply)}
                                        >
                                            {onReply ? '-取消-' : '-回复-'}
                                        </small>
                                    )
                                }

                                <small className='d-flex'>
                                    <div style={{cursor: 'pointer'}} className="comment_nav">
                                        {
                                            (edit || onReply) ? null :
                                            comment.blog_user_id === auth.user?._id
                                                ? comment.user._id === auth.user._id
                                                    ? Nav(comment)
                                                    : <i className='fas fa-trash-alt mx-2 text-danger' onClick={() => handleDelete(comment)}/>
                                                : comment.user._id === auth.user?._id ? Nav(comment) : null
                                        }
                                    </div>
                                    <div>
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </div>
                                </small>
                            </div>
                        </div>
                    )
            }
            {
                onReply && <Input callback={handleReply}/>
            }
            {
                children
            }
        </div>
    );
};

export default CommentList;
