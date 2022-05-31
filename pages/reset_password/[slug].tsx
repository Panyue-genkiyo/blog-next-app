import React, {useEffect, useState} from 'react';
import { useRouter } from "next/router";
import {FormSubmit} from "../../types/globalTypes";
import {useResetPasswordMutation} from "../../hooks/rq-hooks/useUser";
import useCheckIfLoggedIn from "../../hooks/util-hooks/useCheckIfLoggedIn";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";

//重置密码页
const ResetPassword = () => {

    const router = useRouter();
    const { theme } = useAppSelector(state => state);

    const [password, setPassword] = useState('');
    const [cf_password, setCfPassword] = useState('');
    const [typePass, setTypePass] = useState(false);
    const [typeCfPass, setTypeCfPass] = useState(false);
    const {mutate: resetPasswordMutate, data: resetPasswordResData} = useResetPasswordMutation()
    const dispatch = useAppDispatch();
    const { isLogin } = useCheckIfLoggedIn()

    // const navigate = useNavigate();

    const handleSubmit = async (e: FormSubmit) => {
        e.preventDefault();
        resetPasswordMutate({
            token: router.query.slug as string,
            password,
            cf_password,
            dispatch,
        })
    }

    useEffect(() => {
        if(resetPasswordResData !== undefined){
            if(resetPasswordResData){
                 router.replace('/login');
            }
        }
    }, [resetPasswordResData])

    return (
        <div className={`auth_page  ${theme && 'auth-page-night'}`}>
            <form className='auth_box' onSubmit={handleSubmit}>
                <h3 className='text-center my-4'>重置密码</h3>
                <div className="form-group my-2">
                    <label htmlFor="password" className='form-label'>
                        新密码
                    </label>
                    <div className='pass'>
                        <input type={typePass ? "text" : "password"}
                               className='form-control'
                               id='password'
                               name='password'
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               placeholder='密码至少6位'
                        />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? '隐藏' : '显示'}
                        </small>
                    </div>
                </div>
                <div className="form-group my-2">
                    <label htmlFor="cf_password" className='form-label'>
                        确认新密码
                    </label>
                    <div className='pass'>
                        <input type={typeCfPass ? "text" : "password"}
                               className='form-control'
                               id='cf_password'
                               name='cf_password'
                               value={cf_password}
                               onChange={(e) => setCfPassword(e.target.value)}
                               placeholder="请确认您刚才输入密码"
                        />
                        <small onClick={() => setTypeCfPass(!typeCfPass)}>
                            {typeCfPass ? '隐藏' : '显示'}
                        </small>
                    </div>
                </div>
                <button disabled={isLogin === 'true'} type="submit" className='btn btn-dark w-100 mt-2'>
                    重置密码
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
