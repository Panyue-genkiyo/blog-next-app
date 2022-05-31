import React,{ useState, useRef, useEffect } from 'react';
import { useQueryClient } from "react-query";
import Head from 'next/head'
import {Text} from "@mantine/core";
import {IBlog, IUser} from "../types/globalTypes";
import NotFound from "../components/global/NotFound";
import CreateForm from "../components/cards/CreateForm";
import CardHoriz from '../components/cards/CardHoriz';
import { validCreateBlog, shallowEqual } from "../utils/validate";
import {useBlogs, useCreateBlogMutation, useUpdateBlogMutation} from "../hooks/rq-hooks/useBlogs";
import { useRouter } from "next/router";
import { categoriesData } from "../types/rq-types/categoryTypes";
import Loading from "../components/alert/Loading";
import useDeleteDispose from "../hooks/util-hooks/useDeleteDispose";
import CardVert from "../components/cards/CardVert";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {setProfileBlogThumbnail, setThumbnail} from "../features/picFile";
import {setAlert} from "../features/alert";
import dynamic from "next/dynamic";

interface IProps{
    id?: string,
}

const EditorNoSSR = dynamic(() => import('../components/editor/ReactQuillEditor'), {ssr: false})

const CreateBlog: React.FC<IProps> = ( { id }  ) => {

    const initialState = {
        user: '',
        title: '',
        content: '',
        description: '',
        category:'',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: [],
        saved:[],
        savedLength: 0,
        likesLength: 0
    }
    const queryClient = useQueryClient();
    const [blog, setBlog] = useState<IBlog>(initialState);
    const [body, setBody] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [isPresetPT, setIsPresetPT] = useState<boolean>(true);
    const [isPresetT, setIsPresetT] = useState<boolean>(true);
    const [isDispatchError, setIsDispatchError] = useState<boolean>(false);
    const [oldData, setOldData] = useState<IBlog>(initialState);
    const { auth, theme, alert } = useAppSelector(state => state);
    const cd = queryClient.getQueryData<categoriesData>(['categories']);
    const { isError, isLoading, data: bl  } = useBlogs(id);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const divRef = useRef<HTMLDivElement>(null);
    const { mutate: updateBlogMutate } = useUpdateBlogMutation();
    const { mutate: createBlogMutate } = useCreateBlogMutation();


    useEffect(() => {
        dispatch(setThumbnail({
            file: null,
            url: bl ? bl.thumbnail : 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            default: !bl
        }))
        dispatch(setProfileBlogThumbnail({
            file: null,
            url: bl ? bl.profileBlogThumbnail : 'https://images.pexels.com/photos/11419080/pexels-photo-11419080.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
            default: !bl
        }))
        if(!bl) return;
        setBlog(bl);
        setBody(bl.content);
        setOldData(bl);
        const initialData = {
            user: '',
            title: '',
            content: '',
            description: '',
            category:'',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: [],
            saved: [],
            savedLength: 0,
            likesLength: 0
        }

        return () => {
            setBlog(initialData);
            setBody("");
            setOldData(initialData);
            setIsDispatchError(false);
            dispatch(setThumbnail({
                file: null,
                url: null,
            }))
            dispatch(setProfileBlogThumbnail({
                file: null,
                url: null,
            }))
        }
    }, [bl])


    console.log({blog})

    useEffect(() => {
        const div = divRef.current;
        if(!div) return;
        const text = (div.innerText as string);
        setText(text);
    },[body]);


    useEffect(() => {
        if(blog.profileBlogThumbnail && isPresetPT){
            setIsPresetPT(false)
        }
        if(blog.thumbnail && isPresetT) {
            setIsPresetT(false);
        }
    }, [blog.profileBlogThumbnail, blog.thumbnail, isPresetT, isPresetPT])

    useDeleteDispose(isError, id);

    const handleSubmit = async () => {
        if(!auth.access_token || !cd?.categories || !auth.user?._id) return;
        const check = validCreateBlog({ ...blog, content: text });
        if(check.errLength !== 0) {
            setIsDispatchError(true);
            return (!isDispatchError || !alert.errors) && dispatch(setAlert({errors: check.errMsg, isShow:true}));
        }
        let newData = {...blog, content: body};
        if(id){
            if((blog.user as IUser)._id !== auth.user?._id) return dispatch(setAlert({errors: '无权限修改别人的博客', isShow:true}));
            const res = shallowEqual(oldData, newData);
            if(res) {
                //避免多次dispatch
                setIsDispatchError(true)
                return (!isDispatchError || !alert.errors) && dispatch(setAlert({errors: '并没有任何改变', isShow:true}));
            }
            updateBlogMutate({
                userId: auth.user?._id,
                router,
                blog: newData,
                token: auth.access_token,
                dispatch
            })
        }else{
            createBlogMutate({
                userId: auth.user._id,
                blog: newData,
                token: auth.access_token,
                router,
                dispatch,
            })
        }
    }


    if(isLoading) return <Loading/>

    if(isError) return <NotFound/>

    if(!auth.access_token) return <NotFound/>

    return (
        <>
            <Head>
                <title>创建博客</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`my-4 create_blog ${theme && 'create-blog-night'}`} >
                <div className='row mt-4'>
                    <div className="col-md-6">
                        <CreateForm blog={blog} setBlog={setBlog}/>
                    </div>
                    <div className="col-md-6">
                        <h5 className='card-horiz-title'>预览</h5>
                        <div>
                            <Text align="center">个人信息页博客预览</Text>
                            {
                                isPresetPT &&
                                <Text align="center"   variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}>
                                    以下是预置个人信息页博客缩略图
                                </Text>
                            }
                            <CardHoriz blog={blog} isEdit={!!id} isCreated={!id} setBlog={setBlog}/>
                        </div>
                        <div>
                            <Text align="center">主页博客样式预览</Text>
                            {
                                isPresetT &&
                                <Text align="center"   variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}>
                                    以下是预置主页博客缩略图
                                </Text>
                            }
                            <CardVert blog={blog} isEdit={!!id} isCreated={!id} setBlog={setBlog}/>
                        </div>
                    </div>
                </div>
                <EditorNoSSR setBody={setBody} body={body} id={id}/>
                <div ref={divRef} dangerouslySetInnerHTML={{
                    __html: body
                }} style={{ display: "none" }}/>
                <small style={{opacity: '.5'}}>
                    {
                        text.length >= 20 ?
                            `${text.length}`
                            : <span style={{color: 'red'}}>{text.length}/20 (博客内容至少20个字符，还剩{20-text.length}个字符)</span>
                    }
                </small>
                <button className="btn btn-dark mt-3 d-block mx-auto"
                        onClick={handleSubmit}>
                    { id ? '更新博客' : '创建博客' }
                </button>
            </div>
        </>
    );
};

export default CreateBlog;
