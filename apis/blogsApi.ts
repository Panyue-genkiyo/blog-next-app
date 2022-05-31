import { QueryClient } from "react-query";
import { getAPI, deleteAPI, postAPI, patchAPI, putAPI } from "../utils/fetchData";
import { checkTokenExpire } from "../utils/checkTokenExpire";
import imageUpload from "../utils/imageUpload";
import { likeSaveCURDBlogParams } from "../types/rq-types/blogTypes";
import { blogCategoryParams } from "../types/rq-types/blogTypes";
import {setAlert} from "../features/alert";
import axios from "axios";

//无限加载主页blog数据
export const fetchHomeBlogs = ({ pageParam = 1 }) => {
    if(typeof window === 'undefined'){
       return axios.get(`http://localhost:3000/api/home/blogs?page=${pageParam}`).then(res => res.data);
    }else{
       return getAPI(`home/blogs?page=${pageParam}`).then(res => res.data);
    }
}

export const fetchBlog = async (id?: string) => {
    if(typeof window !== 'undefined'){
        return getAPI(`blog/${id}`).then(res => res.data);
    }else{
        const { data } = await axios.get(`http://localhost:3000/api/blog/${id}`);
        return data;
    }
}

export const likeBlog = async ({blog, token, isLike, likes, initialLikes}: likeSaveCURDBlogParams) => {
    if(initialLikes !== undefined && likes !== undefined && initialLikes === likes) return;
    await patchAPI(`blog/${blog._id}/like`, { isLike }, token);
}

export const saveBlog = async ({ blog, token, isSave, saved, initialSaved }: likeSaveCURDBlogParams) => {
    if(initialSaved !== undefined && saved !== undefined && initialSaved === saved) return;
    await patchAPI(`blog/${blog._id}/save`, {isSave}, token);
}

export const createBlog = async ({ blog, token, dispatch, router }: likeSaveCURDBlogParams) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    let url = '';
    let profileBlogThumbnail = '';
    let newBlog = { ...blog };
    dispatch(setAlert({
        loading: true
    }))
    if(blog.thumbnail) {
        if(typeof blog.thumbnail !== 'string'){
            const photo = await imageUpload(blog.thumbnail as File);
            url = photo.url;
        }else {
            url = blog.thumbnail;
        }
        newBlog = {...newBlog, thumbnail: url};
    }
    if(blog.profileBlogThumbnail) {
        if(typeof blog.profileBlogThumbnail !== 'string'){
            const photo = await imageUpload(blog.profileBlogThumbnail as File);
            profileBlogThumbnail = photo.url;
        }else {
            profileBlogThumbnail = blog.profileBlogThumbnail;
        }
        newBlog = {...newBlog, profileBlogThumbnail};
    }
    const res = await postAPI('blog', newBlog, access_token);
    dispatch(setAlert({success: '新建博客ok！'}));
    router && router.push(`/blog/${res.data._id}`);
}

export const updateBlog = async ({ blog, dispatch, token, router }: likeSaveCURDBlogParams) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    let url = '';
    let profileBlogThumbnail = ''
    dispatch(setAlert({
        loading: true
    }))
    if(typeof blog.thumbnail !== 'string'){
        const photo = await imageUpload(blog.thumbnail as File);
        url = photo.url;
    }else{
        url = blog.thumbnail;
    }
    if(typeof blog.profileBlogThumbnail !== 'string'){
        const photo = await imageUpload(blog.profileBlogThumbnail as File);
        profileBlogThumbnail = photo.url;
    }else {
        profileBlogThumbnail = blog.profileBlogThumbnail;
    }
    const newBlog = { ...blog, thumbnail: url, profileBlogThumbnail };
    const res = await putAPI(`blog/${blog._id}`, newBlog, access_token);
    dispatch(setAlert({ success: '更新博客ok！' }))
    router && router.replace(`/blog/${res.data.blog._id}`);
}

export const deleteBlog = async ({token, dispatch, blog }: likeSaveCURDBlogParams) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    await deleteAPI(`blog/${blog._id}`, access_token);
}

export const udSettled = async (_res: any, _error: any, {dispatch, userId, blog, name}: any, _ctx: any, queryClient: QueryClient, actionName: string) => {
    if(actionName === 'delete'){
        dispatch(setAlert({
            success: '博客删除成功',
        }))
    }
    await queryClient.invalidateQueries(['userHomeBlogs', userId])
    await queryClient.invalidateQueries(['homeBlogs']);
    await queryClient.invalidateQueries(['blog', blog._id]);
    await queryClient.invalidateQueries(['categoryBlogs', blog.category]);
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
    if(name && name === 'search'){
        await queryClient.invalidateQueries({
            predicate: query => query.queryKey[0] === 'search'
        });
    }
}

export const fetchBlogListUser = async (name:string, id?: string, limit?: number, page?: number) => {
    let URL = '';
    switch (name) {
        case 'home':
            URL = `/blogs/user/${id}?limit=${limit}&page=${page}`;
            break;
        case 'like':
            URL = `/blogs/like/user/${id}?limit=${limit}&page=${page}`;
            break;
        case 'save':
            URL = `/blogs/save/user/${id}?limit=${limit}&page=${page}`;
            break;
    }
    const { data } = await getAPI(URL);
    return  data;
}

export const fetchBlogsByCategory = async ({page, sort, categoryId}: blogCategoryParams) => {
    let limit = 8;
    let value =`?page=${page}&sort=${sort}`;
    const { data } = await getAPI(`blogs/category/${categoryId}${value}&limit=${limit}`);
    return data;
}

export const searchBlog = async (search: string) => {
    const { data } = await getAPI(`search/blogs?title=${search}`);
    return data;
}
