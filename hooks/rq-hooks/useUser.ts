import {useMutation, useQuery, useQueryClient} from "react-query";
import { updateUserParamsType, resetPasswordParamsType } from '../../types/rq-types/userTypes';
import {HomeBlogs} from "../../types/rd-types/blogTypes";
import {
    fetchOtherUser,
    updateUserInfo,
    resetPassword
} from '../../apis/userApi'
import {setAlert} from "../../features/alert";

export const useOtherUser = (id?: string) => {
    return useQuery(['otherUser', id], () => fetchOtherUser(id), {
        enabled: !!id,
        staleTime: Infinity,
    });
}

export const useUpdateUserInfoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(updateUserInfo, {
        onError:  (err: any, {dispatch}: updateUserParamsType , _ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
        },
        onSettled: async (res, _error, {user, page}: updateUserParamsType, _ctx)  => {
            const homeBlogData = await queryClient.getQueryData<HomeBlogs>(['userHomeBlogs', user._id, { limit: 3, page: page}]);
            if(homeBlogData?.blogs.length && !res){
                await queryClient.invalidateQueries(['homeBlogs']);
                await queryClient.invalidateQueries(['blog']);
                await queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === 'categoryBlogs',
                })
            }
            await  queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'comments'
            })
        }
    })
}

export const useResetPasswordMutation = () => {
      return useMutation(resetPassword, {
        onError:  (err: any, {dispatch}: resetPasswordParamsType , _ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
        },
        onSuccess: (res: any, {dispatch}: resetPasswordParamsType , _ctx) => {
            return res;
        },
    })
}

