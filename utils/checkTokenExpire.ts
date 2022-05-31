import jwt_decode  from 'jwt-decode';
import axios from 'axios';
import {DispatchReturnType} from "../types/globalTypes";
import {setAlert} from "../features/alert";

interface IToken{
    exp: number;
    iat: number;
    id: string;
}

export const checkTokenExpire = async  (token: string, dispatch:DispatchReturnType) => {
    const decoded: IToken = jwt_decode(token);
    if (decoded.exp >= Date.now() / 1000) return;
    const res = await axios.get('/api/refresh_token');
    dispatch(setAlert(res.data));
    return res.data.access_token;
}
