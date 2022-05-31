import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IAuth} from "../../types/rd-types/authTypes";
import {IUserLogin, IUserRegister} from "../../types/globalTypes";
import {getAPI, postAPI} from "../../utils/fetchData";
import {setAlert} from "../alert";
import {DispatchReturnType} from "../../types/globalTypes";
import {validRegister} from "../../utils/validate";
import {checkTokenExpire} from "../../utils/checkTokenExpire";

const initialState:IAuth = {};

//actions
//login
export const login = (userLogin: IUserLogin) => async (dispatch: DispatchReturnType) => {
    try {
        dispatch(setAlert({loading: true}));
        const res = await postAPI('login', userLogin);
        dispatch(setAuth(res.data));
        dispatch(setAlert({success: res.data.msg}));
        localStorage.setItem("logged", "true");
        localStorage.setItem("isFirst", "true")
    } catch (err: any) {
        dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
    }
}

//register
export const register = (userRegister: IUserRegister) => async (dispatch: DispatchReturnType) => {
    const check = validRegister(userRegister);
    if (check.errLength > 0) return dispatch(setAlert({errors: check.errMsg, isShow: true}));
    try {
        dispatch(setAlert({loading: true}));
        const res = await postAPI('register', userRegister);
        dispatch(setAlert({success: res.data.msg}));
    } catch (err: any) {
        dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
    }
}

//logout
export const logout = (token: string) => async (dispatch: DispatchReturnType) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result: token;
    try {
        localStorage.removeItem("logged");
        localStorage.removeItem("isFirst");
        dispatch(setAuth({}))
        const res = await getAPI('logout', access_token);
        dispatch(setAlert({success: res.data.msg}));
    } catch (err: any) {
        dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
    }
}

//google login
export const googleLogin = (id_token: string) => async (dispatch: DispatchReturnType) => {
    try {
        dispatch(setAlert({loading: true}));
        const res = await postAPI('google_login', { id_token });
        res.data.user.type = 'google_login';
        dispatch(setAuth(res.data));
        dispatch(setAlert({success: res.data.msg}));
        localStorage.setItem("logged", "true");
        localStorage.setItem("isFirst", "true")
    } catch (err: any) {
        dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
    }
}

//facebook login
export const facebookLogin = (accessToken: string, userID: string) => async (dispatch: DispatchReturnType) => {
    try {
        dispatch(setAlert({loading: true}));
        const res = await postAPI('facebook_login', { accessToken, userID });
        res.data.user.type = 'facebook_login';
        dispatch(setAuth(res.data));
        dispatch(setAlert({success: res.data.msg}));
        localStorage.setItem("logged", "true");
        localStorage.setItem("isFirst", "true")
    } catch (err: any) {
        dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
    }
}

//forgot password
export const forgotPassword = (account: string) => async (dispatch: DispatchReturnType) => {
    try {
        dispatch(setAlert({loading: true}));
        const res = await postAPI(`forgot_password`, { account });
        dispatch(setAlert({success: res.data.msg}));
    } catch (err: any) {
        dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
    }
}


const authSlice  = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<IAuth>) => action.payload
    }
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;

