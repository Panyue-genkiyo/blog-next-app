import React, {useCallback, useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {Text} from "@mantine/core";
import {IBlog, IUser} from "../../types/globalTypes";
import Input from '../comments/Input';
import Comments from "../comments/Comments";
import Loading from "../global/Loading";
import Pagination from "../global/Pagination";
import LikeButton from "../global/LikeButton";
import SaveButton from "../global/SaveButton";
import {useComments, useCreateCommentMutation} from "../../hooks/rq-hooks/useComments";
import useDebounce from "../../hooks/util-hooks/useDebounce";
import {
    useLikeBlogMutation,
    useSaveBlogMutation,
} from "../../hooks/rq-hooks/useBlogs";
import {showErrMsg} from "../alert/Alert";
import CommentSkeleton from "../skeletons/CommentSkeleton";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setBlogCommentsLocation} from "../../features/userlocation";

interface IProps{
    blog: IBlog,
}

const DisplayBlog: React.FC<IProps> = ({ blog }) => {
    const { auth, theme, userLocation } = useAppSelector(state => state);
    const dispatch = useAppDispatch();
    const [isLike, setIsLike] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(blog?.likes.length);
    const [saves, setSaves] = useState<number>(blog?.saved.length);
    const initialBlogLikes = useRef(blog?.likes.length);
    const initialBlogSaves = useRef(blog?.saved.length);
    const commentPage = blog._id ? userLocation['comments'][blog._id] : undefined;

    const { data: cts, isFetching, error, isError} = useComments({id: blog._id, limit: 4 , page: commentPage});
    const { mutate: addCommentMute } = useCreateCommentMutation();
    const { mutate: likeMute } = useLikeBlogMutation()
    const { mutate: saveMute } = useSaveBlogMutation();

    const likeDebounce = useDebounce(likeMute, 500);
    const saveDebounce = useDebounce(saveMute, 500);

    const handleComment = useCallback((body: string) => {
        if(!auth.user || !auth.access_token) return;
        const data = {
            content: body,
            user: auth.user,
            blog_id: (blog._id as string),
            blog_user_id: (blog.user as IUser)._id,
            createdAt: new Date().toISOString()
        }
        addCommentMute({ token: auth.access_token, dispatch, comment: data, page: commentPage, limit:4, id: blog._id });
    }, [auth, blog._id, blog.user, addCommentMute, dispatch, commentPage])

    const handlePagination = useCallback((num: number) => {
        if(!blog._id) return;
        dispatch(setBlogCommentsLocation({
            blogId: blog._id,
            page: num
        }))
    }, [blog._id, dispatch])

    const handleLike = useCallback((res: boolean) => {
        if(!auth.user || !auth.access_token) return;
        res ? setLikes(prev => prev + 1) : setLikes(prev => prev - 1);
        setIsLike(res);
        likeDebounce({
            blog,
            token: auth.access_token,
            dispatch,
            userId: auth.user._id,
            isLike: res,
            likes: res ? likes + 1 : likes - 1,
            initialLikes: initialBlogLikes.current,
            initialSaved: initialBlogSaves.current,
        });
    }, [likeDebounce, auth.user, likes, auth.access_token, blog, dispatch])

    const handleSave = useCallback((res: boolean) => {
        if(!auth.user || !auth.access_token) return;
        res ? setSaves(prev => prev + 1) : setSaves(prev => prev - 1);
        setIsSaved(res);
        saveDebounce({
            blog,
            token: auth.access_token,
            dispatch,
            userId:
            auth.user._id,
            isSave: res,
            saved: res ? saves + 1 : saves - 1,
            initialSaved:initialBlogSaves.current,
        });
    }, [saveDebounce, auth.user,saves, auth.access_token, blog, dispatch])

    useEffect(() => {
        setLikes(blog.likes.length);
        initialBlogLikes.current = blog.likes.length;
        if(!auth.user?._id) return;
        if(blog.likes.find( item => (item as IUser)._id === auth.user?._id || item === auth.user?._id)) {
            setIsLike(true);
        }else{
            setIsLike(false);
        }
        return () => {
            setIsLike(false);
        }
    }, [blog.likes, auth.user?._id]);

    useEffect(() => {
        setSaves(blog.saved.length);
        initialBlogSaves.current = blog.saved.length;
        if(!auth.user?._id) return;
        if(blog.saved.find( item => (item as IUser)._id === auth.user?._id || item === auth.user?._id)) setIsSaved(true);
        else setIsSaved(false);
        return () => {
            setIsSaved(false);
        }

    }, [blog.saved, auth.user?._id])

    if(isError) return showErrMsg((error as any).response.data.msg);

    return (
        <div className='blog_detail'>
            <h2 className='text-center my-3 text-capitalize fs-1 blog_title' style={{ color: '#ff7a00' }}>
                {blog.title}
            </h2>
            <div className={`text-end fst-italic ${theme && 'blog-detail-night'}`} style={{ color: 'teal' }}>
                <small>
                    {
                         `By: ${(blog.user as IUser).name}`
                    }
                </small>
                <small className='ms-2'>
                    {new Date(blog.createdAt).toLocaleString()}
                </small>
            </div>
            <div className='blog_action' >
                {
                    (
                        <>
                            <div>
                                <LikeButton isLike={isLike} handleLike={handleLike}/>
                                <span>{ likes }</span>
                            </div>
                            <div>
                                <SaveButton isSaved={isSaved} handleSave={handleSave}/>
                                <span>{ saves }</span>
                            </div>
                        </>
                    )
                }
            </div>
            <div className={`blog_container ${theme && 'blog-detail-night'}`} dangerouslySetInnerHTML={{
                __html: blog.content
            }}/>
            <div className={`blog_update_info`}>
                <Text
                    component="span"
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                    size="sm"
                    weight={700}
                    style={{ fontFamily: 'Greycliff CF, sans-serif' }}
                >
                    {blog.createdAt !== blog.updatedAt && `博文最后修改于${new Date(blog.updatedAt).toLocaleString()}`}
                </Text>
            </div>
            {
                (!cts) ? <CommentSkeleton/> : (
                    <>
                        <hr className='my-1'/>
                        <h3 style={{ color: '#00cec9' }}>评论</h3>

                        {
                            auth.user ? <Input callback={handleComment}/>
                                : (
                                    <h5>
                                        请先<Link href={`/login?blog/${blog._id}`}>登录</Link>再评论
                                    </h5>
                                )
                        }

                        {
                            cts.comments?.map((comment, index) => (
                                <Comments key={index} comment={comment}/>
                            ))
                        }

                        {
                            (cts && isFetching) ? <Loading/> : cts && (cts.total > 1 && (
                                <Pagination
                                    total={cts.total}
                                    callback={handlePagination}
                                    active={commentPage || 1}
                                />
                            ))
                        }
                    </>
                )
            }
        </div>
    );
};

export default DisplayBlog;
