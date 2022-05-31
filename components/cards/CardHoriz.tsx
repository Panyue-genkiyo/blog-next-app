import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useModals } from "@mantine/modals";
import {IBlog, IUser} from "../../types/globalTypes";
import {useDeleteBlogMutation} from "../../hooks/rq-hooks/useBlogs";
import {Text, Button} from "@mantine/core";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setProfilePic} from "../../features/picFile";
import {setAlert} from "../../features/alert";

interface IProps {
    blog: IBlog;
    isEdit?: boolean;
    isCreated?: boolean;
    name?: string;
    setOpen?: (open: boolean) => void;
    setSearch?: (search: string) => void;
    setBlog?: (blog: IBlog) => void;
}

const CardHoriz : React.FC<IProps> = ({ blog, name , isEdit , setOpen, setSearch, isCreated, setBlog}) => {
    const { slug } = useRouter().query
    const modal = useModals();
    const [initProfileThumbnail, setInitProfileThumbnail] =  useState('');
    const [next, setNext] = useState(true);
    const { auth, theme, pic } = useAppSelector(state => state);
    const dispatch = useAppDispatch();
    const blogOwner = blog.user as IUser;
    const { mutate: deleteBlogMutate } = useDeleteBlogMutation()


    useEffect(() => {
        if((isEdit || isCreated) && pic.profileBlogThumbnail.url && pic.profileBlogThumbnail.default !== undefined && next){
            setInitProfileThumbnail(pic.profileBlogThumbnail.url);
            if(isEdit && !pic.profileBlogThumbnail.default){
                return setNext(false);
            }
            if(isCreated && pic.profileBlogThumbnail.default){
                return setNext(false);
            }
        }
    }, [isEdit, isCreated, pic.profileBlogThumbnail.url, pic.profileBlogThumbnail.default, next])

    const handleDelete = async () => {
        if(!auth.user || !auth.access_token) return;
        modal.openConfirmModal({
            title: '删除这篇博客',
            centered: true,
            zIndex: 5002,
            children: (
                <Text size='sm'>
                    你确定要删除你的这篇博客吗？这个行为是破坏性的，你将无法恢复该篇博文的数据
                </Text>
            ),
            labels: {
                confirm: '删除',
                cancel: '取消'
            },
            confirmProps: {
                color: 'red'
            },
            onConfirm: () => {
                deleteBlogMutate({
                    userId: auth.user?._id as string,
                    blog,
                    token: auth.access_token as string,
                    dispatch,
                    name,
                })
            }
        })
    }

    const handleLink = async () => {
        if(name && name === 'search' && setSearch && setOpen){
            setOpen(false);
            setSearch('');
        }
    }

    const handelCancelProfileTB = () => {
        if(blog.profileBlogThumbnail){
            setBlog && setBlog({
                ...blog,
                profileBlogThumbnail: initProfileThumbnail ? initProfileThumbnail: undefined,
            })
            dispatch(setProfilePic({
                file: null,
                url: (isCreated || isEdit) ? initProfileThumbnail : null,
            }))
        }
    }

    const handelResetProfileTB = () => {
        dispatch(setAlert({
            isModalOpen: true,
            isCircle: false,
            isProfileThumbnail: true,
            modalTitle: '裁剪个人主页博客预览照片',
            imageUrl: pic.profileBlogThumbnail.url ? pic.profileBlogThumbnail.url : blog.profileBlogThumbnail,
            picType: 'profileBlogThumbnail'
        }))
    }

    return (
        <>
            {
                ((isEdit || isCreated ) && initProfileThumbnail !== blog.profileBlogThumbnail && blog.profileBlogThumbnail) && (
                    <div>
                        <Button variant="gradient" onClick={handelCancelProfileTB} gradient={{ from: 'teal', to: 'blue', deg: 60 }}>重置</Button>
                    </div>
                )
            }
            <div className={`card mb-3 ${theme && 'card-night'} card-personal`} style={{minWidth: "260px"}}>
                <div className="row g-0 p-2 card-personal-flex">
                    <div className="col-md-3 col-sm-3 col-3" style={{minHeight: '150px', maxHeight:"170px", maxWidth: '120px', overflow: "hidden"}}>
                        {
                            blog.profileBlogThumbnail ?
                                <>
                                    {
                                        typeof blog.profileBlogThumbnail === "string" ? (
                                                ( isEdit || isCreated  ) ?
                                                    <img src={blog.profileBlogThumbnail}
                                                         className="h-100"
                                                         alt="profileBlogThumbnail"
                                                         onClick={handelResetProfileTB}
                                                         style={{objectFit: 'cover', maxWidth: '100%', cursor: 'pointer'}}
                                                    />
                                                    :
                                                    <Link href={`/blog/${blog._id}`}>
                                                        <img src={blog.profileBlogThumbnail}
                                                             onClick={handleLink}
                                                             className="h-100"
                                                             alt="profileBlogThumbnail"
                                                             style={{objectFit: 'cover', maxWidth: '100%'}}
                                                        />
                                                    </Link>
                                            ):
                                            (
                                                (isEdit || isCreated)  ?
                                                    <img src={URL.createObjectURL(blog.profileBlogThumbnail)}
                                                         className="h-100"
                                                         onClick={handelResetProfileTB}
                                                         style={{objectFit: 'cover', maxWidth: '100%', cursor: 'pointer'}}
                                                         alt=""
                                                    />:
                                                    <Link href={`/blog/${blog._id}`}>
                                                        <img src={URL.createObjectURL(blog.profileBlogThumbnail)}
                                                             onClick={handleLink}
                                                             className="h-100"
                                                             style={{objectFit: 'cover', maxWidth: '100%'}}
                                                             alt=""
                                                        />
                                                    </Link>
                                            )
                                    }
                                </>
                                :
                                <img src={'https://images.pexels.com/photos/11419080/pexels-photo-11419080.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'}
                                     className="h-100"
                                     onClick={handelResetProfileTB}
                                     alt="profileBlogThumbnail"
                                     style={{objectFit: 'cover', maxWidth: '100%', cursor: 'pointer'}}
                                />
                        }
                    </div>
                    <div className="col-md-9 col-sm-9 col-9">
                        <div className="card-body">
                            {
                                (isEdit || isCreated) ? (
                                    <h5 style={{ color: "#0d6efd" }} className='card-title'>
                                        {blog.title}
                                    </h5>
                                ) : (
                                    <h5 className="card-title">
                                        <Link href={`/blog/${blog._id}`}
                                              className='text-capitalize text-decoration-none'
                                              passHref
                                        >
                                            <a onClick={handleLink}>{blog.title}</a>
                                        </Link>
                                    </h5>
                                )
                            }
                            <p className="card-text">{blog.description}</p>
                            {
                                blogOwner._id && blogOwner._id !== auth.user?._id &&
                                <p className="card-text">
                                    <Link href={`/profile/${blogOwner._id}`} style={{ textDecoration: 'none' }} passHref>
                                        <a onClick={handleLink}>{`By ${blogOwner.name}`}</a>
                                    </Link>
                                </p>
                            }
                            {
                                blog.title ?
                                    <div className="card-text d-flex justify-content-between
                align-items-center"
                                    >
                                        {
                                            (!isCreated && !isEdit) && ((auth.user && slug === auth.user._id && blogOwner._id === auth.user._id) || blogOwner._id === auth.user?._id )
                                            &&
                                            <div style={{cursor: 'pointer'}}>
                                                <Link href={`/update_blog/${blog._id}`}>
                                                    <i className="fas fa-edit" title="edit" onClick={handleLink}/>
                                                </Link>

                                                <i className="fas fa-trash text-danger mx-3"
                                                   title="edit" onClick={handleDelete}/>
                                            </div>
                                        }
                                        {
                                            (!isCreated && !isEdit) && <small className="text-muted">
                                                {new Date(blog.createdAt).toLocaleString()}
                                            </small>
                                        }
                                    </div> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardHoriz;
