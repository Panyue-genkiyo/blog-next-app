import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    useCUDRCommentMutationProps,
    useCommentsProps,
    ICommentState
} from "../../types/rq-types/commentTypes";
import {
    fetchComments,
    createComment,
    deleteComment,
    updateComment,
    replyComment
} from '../../apis/commentsApi'
import {setAlert} from "../../features/alert";

export const useComments = ({id, limit = 4, page = 1}: useCommentsProps) => {
    return useQuery<ICommentState>(["comments", {id, limit, page}], () => fetchComments(id, limit, page), {
        enabled: !!id,
        staleTime: Infinity,
        keepPreviousData: true,
        cacheTime: 5 * 60 * 1000, // 5 minutes
    })
};

export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(createComment, {
        onMutate: async ({comment, id, limit, page}: useCUDRCommentMutationProps) => {
            await queryClient.cancelQueries(['comments', {id, limit, page}]);
            const prevComments = await queryClient.getQueryData<ICommentState>(['comments', {id, limit, page}]);
            if (prevComments) {
                const newComments = [comment, ...prevComments.comments];
                const total = newComments.length % (limit as number) === 0 ? newComments.length / (limit as number) : Math.floor(newComments.length / (limit as number)) + 1;
                queryClient.setQueryData(['comments', {id, limit, page}], {comments: newComments, total});
            }
            return {
                prevComments,
            }
        },
        onError: (err: any, {dispatch, id, limit, page}: useCUDRCommentMutationProps, ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            queryClient.setQueryData(['comments', {id, limit, page}], ctx?.prevComments);
        },
        onSettled: async (_res, _error, {id}: useCUDRCommentMutationProps, _ctx) => {
            await queryClient.invalidateQueries(['comments', {id}]);
        }
    })
}

export const useUpdateCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(updateComment, {
        onMutate: async ({comment, id, limit, page}: useCUDRCommentMutationProps) => {
            await queryClient.cancelQueries(['comments', {id, limit, page}]);
            const prevComments = await queryClient.getQueryData<ICommentState>(['comments', {id, limit, page}]);
            if (prevComments) {
                if(!comment.comment_root){
                    const newComments = prevComments.comments.map(item => {
                        if (item._id === comment._id) {
                            return comment;
                        }
                        return item;
                    });
                    queryClient.setQueryData(['comments', {id, limit, page}], {comments: newComments, total: prevComments.total});
                }else{
                    const newComments = prevComments.comments.map(c => {
                        if (c._id === comment.comment_root) {
                            c.replyCM = c.replyCM?.map(rc => rc._id === comment._id ? comment : rc);
                            return c;
                        }
                        return c;
                    });
                    queryClient.setQueryData(['comments', {id, limit, page}], {comments: newComments, total: prevComments.total});
                }
            }
            return {
                prevComments,
            }
        },
        onError: (err: any, {dispatch, id, limit, page}: useCUDRCommentMutationProps, ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            queryClient.setQueryData(['comments', {id, limit, page}], ctx?.prevComments);
        },
    })
}

export const useDeleteCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteComment, {
        onMutate: async ({comment, id, limit, page, router}: useCUDRCommentMutationProps) => {
            await queryClient.cancelQueries(['comments', {id, limit, page}]);
            const prevComments = await queryClient.getQueryData<ICommentState>(['comments', {id, limit, page}]);
            if (prevComments) {
                if(!comment.comment_root){
                    const newComments = prevComments.comments.filter(item => item._id !== comment._id);
                    const total = newComments.length % (limit as number) === 0 ? newComments.length / (limit as number) : Math.floor(newComments.length / (limit as number)) + 1;
                    if(newComments.length === 0) {
                        queryClient.removeQueries(['comments', {id, limit, page}]);
                        let lastPage = page && (page > 1) ? page - 1 : 1;
                        const lastComments = await queryClient.getQueryData<ICommentState>(['comments', {id, limit, page: lastPage}]);
                        queryClient.setQueryData(['comments', {id, limit, page: lastPage}], {comments: lastComments?.comments, total: 1});
                        router && router.push(`/blog/${id}?page=${lastPage}`);
                    }else {
                        queryClient.setQueryData(['comments', {id, limit, page}], {comments: newComments, total});
                    }
                }else{
                    const newComments = prevComments.comments.map(c => {
                        if(c._id === comment.comment_root){
                            c.replyCM?.splice(c.replyCM.findIndex(cm => cm._id === comment._id), 1);
                            return c;
                        }
                        return c;
                    });
                    queryClient.setQueryData(['comments', {id, limit, page}], {comments: newComments, total: prevComments.total});
                }
            }
            return {
                prevComments,
            }
        },
        onError: (err: any, {dispatch, id, limit, page}: useCUDRCommentMutationProps, ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            queryClient.setQueryData(['comments', {id, limit, page}], ctx?.prevComments);
        },
        onSettled: async (_res, _error, {id, dispatch, limit, page}: useCUDRCommentMutationProps, _ctx) => {
            await queryClient.invalidateQueries(['comments', {id}]);
        }
    })
}

export const useReplyCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(replyComment, {
        onMutate: async ({comment, id, limit, page}: useCUDRCommentMutationProps) => {
            await queryClient.cancelQueries(['comments', {id, limit, page}]);
            const prevComments = await queryClient.getQueryData<ICommentState>(['comments', {id, limit, page}]);
            if(prevComments){
                const newComments =  prevComments.comments.map(c => {
                    if(c._id === comment.comment_root){
                        c.replyCM?.push(comment);
                        return c;
                    }
                    return c;
                });
                queryClient.setQueryData(['comments', {id, limit, page}], {comments: newComments, total: prevComments.total});
            }
            return {
                prevComments,
            }
        },
        onError: (err: any, {dispatch, id, limit, page}: useCUDRCommentMutationProps, ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            queryClient.setQueryData(['comments', {id, limit, page}], ctx?.prevComments);
        },
        onSettled: async (_res, _error, {id, limit, page}: useCUDRCommentMutationProps, _ctx) => {
            await queryClient.invalidateQueries(['comments', {id, limit, page}]);
        }
    });
}



