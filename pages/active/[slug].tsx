import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { postAPI } from "../../utils/fetchData";
import { showErrMsg, showSuccessMsg } from '../../components/alert/Alert'
import {useAppDispatch} from "../../hooks/redux-hooks";
import {setAlert} from "../../features/alert";
//激活用户账户
const Active = () => {
    const router = useRouter();
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');
    const dispatch = useAppDispatch();

    useEffect(() => {
        let timer: NodeJS.Timeout  | null = null;
        if(router.query.slug) {
            postAPI('active', { active_token: router.query.slug })
                .then(res => {
                    setSuccess(res.data.msg)
                    dispatch(setAlert({success:  `${res.data.msg}, 2s后跳转登录页！` }))
                    timer = setTimeout(() => {
                        router.replace('/login')
                    }, 2000)
                })
                .catch(err => {
                    setErr(err.response.data.msg)
                    dispatch(setAlert({ errors:  `${err.response.data.msg}, 2s后关闭该页面，请返回申请页重试` }))
                    timer = setTimeout(() => {
                        window.open("about:blank", "_self");
                        window.close();
                    }, 2000)
                })
        }
        return () => {
            if(timer) {
                clearTimeout(timer);
            }
        }
    }, [router.query.slug])
    return (
        <div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
        </div>
    );
};

export default Active;
