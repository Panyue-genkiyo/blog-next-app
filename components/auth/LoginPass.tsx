import React, {useState} from 'react';
import { InputChange, FormSubmit } from "../../types/globalTypes";
import { login } from '../../features/auth';
import {useAppDispatch} from "../../hooks/redux-hooks";

//按密码来登录
const LoginPass = () => {
    const initialState = {
        account:'',
        password: '',
    };
    const dispatch = useAppDispatch();
    const [userLogin, setUserLogin] = useState(initialState);
    const [typePass, setTypePass] = useState(false);
    const {account, password} = userLogin;
    const handleChangeInput = (e: InputChange) => {
        const { value, name } = e.target;
        setUserLogin({
            ...userLogin,
            [name]: value
        });
    }

    //提交登录之后
    const handleSubmit = (e: FormSubmit) => {
         e.preventDefault();
         dispatch(login(userLogin));
         setUserLogin({
             ...userLogin,
             password: ''
         });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label htmlFor="account" className='form-label'>
                    邮箱
                </label>
                <input type="text" className='form-control'
                       id='account' name='account' value={account}
                       onChange={handleChangeInput}
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="password" className='form-label'>
                    密码
                </label>
                <div className='pass'>
                    <input type={typePass ? "text" : "password"}
                           className='form-control'
                           id='password'
                           name='password'
                           value={password}
                           onChange={handleChangeInput}
                    />
                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? '隐藏' : '显示'}
                    </small>
                </div>
            </div>
            <button type="submit" className='btn btn-dark w-100'
               disabled={(!(account && password))}>
                登录
            </button>
        </form>
    );
};

export default LoginPass;
