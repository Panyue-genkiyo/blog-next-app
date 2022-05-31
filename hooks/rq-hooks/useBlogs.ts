import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "react-query";
import {IBlog} from "../../types/globalTypes";
import {HomeBlogs, IBlogsCategory, IBlogsUser} from "../../types/rd-types/blogTypes";
import {likeSaveCURDBlogParams} from "../../types/rq-types/blogTypes";
import {
    fetchBlog,
    fetchBlogListUser,
    fetchBlogsByCategory,
    fetchHomeBlogs,
    searchBlog,
    udSettled,
    likeBlog,
    saveBlog,
    deleteBlog,
    createBlog,
    updateBlog
} from '../../apis/blogsApi'
import {setAlert} from "../../features/alert";

export const useHomeBlogs = () => {
    return useInfiniteQuery<HomeBlogs>(
        ['homeBlogs'],
        fetchHomeBlogs,
        {
            staleTime: Infinity,
            getNextPageParam: (lastPage, _allPages) => {
                if(lastPage.hasMore){
                    return lastPage.page + 1;
                }else{
                    return undefined;
                }
            }
        }
    );
};

export const useBlogs = (id?: string) =>  {
    const queryClient = useQueryClient();
    return useQuery(['blog', id], () => fetchBlog(id), {
        enabled: !!id,
        staleTime: Infinity,
        initialData: () => {
            const blogData = queryClient.getQueryData<IBlog[]>(['k1']);
            return blogData?.find(b => b._id === id);
        }
    });
};

export const useSearchBlogs = (search: string, flag: boolean) => {
    return useQuery<IBlog[]>(['search', search], () => searchBlog(search), {
        enabled: !!search && search.length >= 2 && flag,
        staleTime: Infinity,
    });
}

export const useUserHomeBlogs = (name:string, id?: string, limit: number = 3, page: number = 1) => {
    let key: any = [null, id, {limit, page }]
    switch (name){
        case 'home':
            key[0] = 'userHomeBlogs'
            break;
        case 'like':
            key[0] = 'userHomeBlogsLike'
            break;
        case 'save':
            key[0] = 'userHomeBlogsSave'
            break;
        default:
            key[0] = 'userHomeBlogs'
            break;
    }
    return useQuery<IBlogsUser>(key, () => fetchBlogListUser(name, id, limit, page), {
        enabled: !!id && name !== undefined,
        staleTime: Infinity,
        keepPreviousData: true
    });
};

export const useCategoryBlogs = (categoryId?:string, page?: number, sort?: string) => {
     return useQuery<IBlogsCategory>(['categoryBlogs', categoryId, {page, sort}], () => fetchBlogsByCategory({page, sort, categoryId}), {
         staleTime: Infinity,
         keepPreviousData: true,
         enabled: !!categoryId,
         cacheTime: 5 * 60 * 1000 // 5 minutes
     });
}

export const useLikeBlogMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(likeBlog, {
        onMutate: async ({ blog, userId, isLike, initialLikes,likes }: likeSaveCURDBlogParams) => {
            await queryClient.cancelQueries(['blog', blog._id]);
            const previousBlog = queryClient.getQueryData<IBlog>(['blog',blog._id]);
            let newBlog: any = null;
            if(initialLikes !== undefined && likes !== undefined && likes === initialLikes) return;
            if(isLike === true && previousBlog){
                newBlog = {...previousBlog, likes: [...previousBlog.likes, userId],likesLength: previousBlog.likesLength + 1};
            }else if(isLike === false && previousBlog){
                newBlog = { ...previousBlog, likes: blog.likes.filter(l => {
                        if(typeof l === 'string'){
                            return l !== userId
                        }else{
                            return l._id !== userId
                        }
                    }), likesLength: previousBlog.likesLength - 1};
            }
            queryClient.setQueryData(['blog', blog._id], newBlog);
            return { previousBlog };
        },
        onError: (err: any, {dispatch, blog}: likeSaveCURDBlogParams , ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            queryClient.setQueryData(['blog', blog._id], ctx?.previousBlog);
        },
        onSettled: async (_res, _error, { dispatch, userId, blog, initialLikes, likes }: likeSaveCURDBlogParams, _ctx ) => {
            await queryClient.invalidateQueries(['userHomeBlogsLike', userId]);
            await queryClient.invalidateQueries(['homeBlogs']);
            if(initialLikes !== undefined && likes !== undefined && likes === initialLikes) return;
            await queryClient.invalidateQueries(['categoryBlogs', blog.category]);
        }
    })
}

export const useSaveBlogMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(saveBlog, {
        onMutate: async ({ blog, userId, isSave, initialSaved, saved }: likeSaveCURDBlogParams) => {
            await queryClient.cancelQueries(['blog', blog._id]);
            const previousBlog = queryClient.getQueryData<IBlog>(['blog',blog._id]);
            let newBlog: any = null;
            if(initialSaved !== undefined && saved !== undefined && saved === initialSaved) return;
            if(isSave === true && previousBlog){
                newBlog = {...blog, saved: [...previousBlog.saved, userId],savedLength: previousBlog.savedLength + 1};
            }else if(isSave === false && previousBlog){
                newBlog = { ...previousBlog, saved: blog.saved.filter(l => {
                        if(typeof l === 'string'){
                            return l !== userId
                        }else{
                            return l._id !== userId
                        }
                    }),
                    savedLength: previousBlog.savedLength - 1
                }
            }
            queryClient.setQueryData(['blog', blog._id], newBlog);
            return { previousBlog };
        },
        onError: (err: any, {dispatch, blog}: likeSaveCURDBlogParams , ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            queryClient.setQueryData(['blog', blog._id], ctx?.previousBlog);
        },
        onSettled: async (_res, _error, { dispatch, userId, blog, initialSaved, saved}: likeSaveCURDBlogParams, _ctx ) => {
            await queryClient.invalidateQueries(['userHomeBlogsSave', userId]);
            await queryClient.invalidateQueries(['homeBlogs']);
            if(initialSaved !== undefined && saved !== undefined && saved === initialSaved) return;
            await queryClient.invalidateQueries(['categoryBlogs', blog.category]);
        }
    })
}

export const useCreateBlogMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(createBlog, {
        onError: (err: any, {dispatch}: likeSaveCURDBlogParams, _ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
        },
        onSettled: async (_res, _error, {dispatch, userId, blog}: likeSaveCURDBlogParams, _ctx) => {
            await queryClient.invalidateQueries(['userHomeBlogs', userId]);
            await queryClient.invalidateQueries(['homeBlogs']);
            await queryClient.invalidateQueries(['categoryBlogs', blog.category])
        }
    })
}

export const useUpdateBlogMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(updateBlog, {
        onMutate: async ({ blog }: likeSaveCURDBlogParams) => {
            await queryClient.cancelQueries(['blog', blog._id]);
            queryClient.setQueryData(['blog', blog._id], blog);
        },
        onError: (err: any, {dispatch}: likeSaveCURDBlogParams , _ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
        },
        onSettled: (_res, _error, {dispatch, userId, blog}, _ctx) => udSettled(_res, _error, {
            dispatch,
            userId,
            blog
        }, _ctx, queryClient, 'update')
    })
}

export const useDeleteBlogMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteBlog, {
        onError: (err: any, {dispatch}: likeSaveCURDBlogParams, _ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
        },
        onSettled: (_res, _error, {dispatch, userId, blog, name}, _ctx) => udSettled(_res, _error, {
            dispatch,
            userId,
            blog,
            name
        }, _ctx, queryClient, 'delete')
    })
}

