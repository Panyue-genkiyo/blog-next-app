import {  getAPI, patchAPI, postAPI, deleteAPI } from "../utils/fetchData";
import {checkTokenExpire} from "../utils/checkTokenExpire";
import { useCUDRCommentMutationProps } from "../types/rq-types/commentTypes";
import axios from "axios";

export const fetchComments = async (id: string | undefined, limit = 4, page = 1) => {
    if(typeof window  !== 'undefined'){
        const res = await getAPI(`comments/blog/${id}?page=${page}&limit=${limit}`);
        return res.data
    }else{
        const {data} = await axios.get(`http://localhost:3000/api/comments/blog/${id}?page=${page}&limit=${limit}\``)
        return data;
    }
}

export const createComment = async ({token, dispatch, comment}: useCUDRCommentMutationProps) =>  {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    const { data } = await postAPI('comment', comment, access_token);
    return data;
}

export const updateComment = async ({token, dispatch, comment}: useCUDRCommentMutationProps) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    const { data } =  await patchAPI(`comment/${comment._id}`, {
        data: comment
    }, access_token);
    return data;
}

export const deleteComment = async ({token, dispatch,comment}: useCUDRCommentMutationProps) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    await deleteAPI(`comment/${comment._id}`, access_token);
}

export const replyComment = async ({token, dispatch,comment}: useCUDRCommentMutationProps) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    await postAPI('reply_comment', comment, access_token);
}
