import { getAPI, patchAPI } from "../utils/fetchData";
import { checkTokenExpire } from "../utils/checkTokenExpire";
import { checkPassword } from "../utils/validate";
import imageUpload, { checkImage } from "../utils/imageUpload";
import { IUser } from "../types/globalTypes";
import { updateUserParamsType, resetPasswordParamsType } from "../types/rq-types/userTypes";
import {setAlert} from "../features/alert";
import {setAuth} from "../features/auth";

export const fetchOtherUser = async (id?: string) => {
    const {data} = await getAPI(`user/${id}`);
    return data;
}

export const updateUserInfo = async ({token, user, dispatch, avatar, name}: updateUserParamsType) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    let flag = false;
    let url = '';
    dispatch(setAlert({loading: true}))
    if (avatar) {
        const check = checkImage(avatar);
        if(check) return dispatch(setAlert({errors: check, isShow: true}));
        const photo = await imageUpload(avatar);
        url = photo.url;
    }
    if(name === (user as IUser).name) flag = true
    dispatch(setAuth({
        access_token,
        user: {
            ...(user as IUser),
            avatar: url ? url : (user as IUser).avatar,
            name: name ? name : (user as IUser).name
        }
    }))

    const res = await patchAPI(`/user`, {
        avatar: url ? url : (user as IUser).avatar,
        name: name ? name : (user as IUser).name
    }, access_token);

    dispatch(setAlert({success: res.data.msg}))
    return flag;
}

export const resetPassword = async ({ token, password, cf_password, dispatch}: resetPasswordParamsType) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    const msg = checkPassword(password, cf_password);
    if (msg){
        dispatch(setAlert({errors: msg, isShow: true}));
        return false;
    }
    dispatch(setAlert({loading: true}))
    await patchAPI('reset_password', {password}, access_token);
    dispatch(setAlert({success: '更新密码成功'}))
    return true;
}
