import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import { useRouter } from "next/router";
import {useQueryClient} from "react-query";
import CardHoriz from '../cards/CardHoriz'
import Loading from '../global/Loading';
import Pagination from '../global/Pagination'
import NotContent from "../global/NotContent";
import {useUserHomeBlogs} from "../../hooks/rq-hooks/useBlogs";
import {showErrMsg} from "../alert/Alert";
import ProfileBlogSkeleton from "../skeletons/ProfileBlogSkeleton";
import {useAppSelector} from "../../hooks/redux-hooks";
import {setUserLocation} from "../../features/userlocation";

interface IProps{
    name: 'home' | 'save' | 'like'
}

const UserBlogs: React.FC<IProps> = ({ name }) => {
    const { auth, userLocation } = useAppSelector(state => state);
    const router = useRouter();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const num = queryClient.isFetching(['refreshToken'])
    const user_id = router.query.slug as string;
    const homePage =  user_id ? userLocation['user'][user_id]?.[name] : undefined;
    const { data: userBlogs, error, isError, isFetching, isLoading } = useUserHomeBlogs(name, user_id,3, homePage);

    const handlePagination = useCallback((num: number) => {
        if (user_id) {
            dispatch(setUserLocation({
                target: name,
                userId: user_id,
                page: num
            }))
        }
    },[name, user_id]);

    if(num === 1 || isLoading) return <ProfileBlogSkeleton/>

    if(isError) return showErrMsg((error as any).message);

    if(userBlogs?.blogs.length === 0 && userBlogs?.total < 1 && !isFetching) return <NotContent msg={`${ auth.user?._id === user_id ? '你': 'TA' }还没有个人博客哦${auth.user?._id === user_id ? ',赶紧去写一篇吧': ''}`}/>

    return (
        <div className='mt-2'>
            <div>
                {
                    userBlogs?.blogs.map(blog => (
                        <CardHoriz key={blog._id} blog={blog} />
                    ))
                }
            </div>

            <div>
                {isFetching ? <Loading/> : ( (userBlogs?.total as number) > 1 && <Pagination
                    total={userBlogs?.total as number}
                    callback={handlePagination}
                    active={homePage || 1}
                />)}
            </div>
        </div>
    )
}

export default UserBlogs
