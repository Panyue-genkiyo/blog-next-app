import { getAPI } from "../utils/fetchData";
import {setAuth} from "../features/auth";

export const getRefreshToken = async (dispatch:any) => {
    const res = await getAPI('refresh_token');
    dispatch(setAuth(res.data))
    return res.data;
}

export const getIsLogged = () => localStorage.getItem('logged');
