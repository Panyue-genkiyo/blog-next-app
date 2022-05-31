import { useEffect } from "react";
// import {useNavigate, useLocation} from "react-router-dom";
import useAuth from "../rq-hooks/useAuth";
import {useAppDispatch} from "../redux-hooks";
import {setAlert} from "../../features/alert";


export default function useCheckIfLoggedIn() {

    const { data: isLogin } = useAuth();
    const dispatch = useAppDispatch();
    // const navigate = useNavigate();
    // const {key} = useLocation();

    // useEffect(() => {
    //     let timer: NodeJS.Timer | null = null
    //     if(isLogin === 'true'){
    //         dispatch(setAlert({success: `已经登入该系统，${key === 'default' ? '2s后返回首页' : '2s后关闭该页面'}`}));
    //         timer = setTimeout(() => {
    //             if(key !== 'default'){
    //                 window.open("about:blank", "_self");
    //                 window.close();
    //             }
    //             else navigate('/', { replace: true });
    //         }, 2000)
    //     }
    //     return () => {
    //         if(timer) clearTimeout(timer)
    //     }
    // }, [isLogin, key, dispatch, navigate])

    return { isLogin }
}
