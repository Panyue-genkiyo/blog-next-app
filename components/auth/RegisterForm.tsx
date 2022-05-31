import React, {useState} from 'react';

import { InputChange, FormSubmit } from "../../types/globalTypes";
import { register } from "../../features/auth";
import {useAppDispatch} from "../../hooks/redux-hooks";

//用户注册组件
interface IProps{
  isLogin: string | null | undefined
}

const RegisterForm:React.FC<IProps> = ({isLogin}) => {
    const initialState = {
        name:'',
        account:'',
        password: '',
        cf_password: '',
    };
    const dispatch = useAppDispatch();
    const [userRegister, setUserRegister] = useState(initialState);
    const [typePass, setTypePass] = useState(false);
    const [typeCfPass, setTypeCfPass] = useState(false);

    const {name, cf_password ,account, password} = userRegister;
    const handleChangeInput = (e: InputChange) => {
        const { value, name } = e.target;
        setUserRegister({
            ...userRegister,
            [name]: value
        });
    }

    //提交注册之后
    const handleSubmit = (e: FormSubmit) => {
       e.preventDefault();
       dispatch(register(userRegister));
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label htmlFor="name" className='form-label'>
                    昵称
                </label>
                <input type="text" className='form-control'
                       id='name' name='name' value={name}
                       onChange={handleChangeInput}
                       placeholder='昵称最长不能超过20位'
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="account" className='form-label'
                  >
                    邮箱
                </label>
                <input type="text" className='form-control'
                       id='account' name='account' value={account}
                       onChange={handleChangeInput}
                       placeholder="Example@qq.com"
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
                           placeholder='密码至少6位'
                    />
                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? '隐藏' : '显示'}
                    </small>
                </div>
            </div>
            <div className="form-group mb-3">
                <label htmlFor="cf_password" className='form-label'>
                    确认密码
                </label>
                <div className='pass'>
                    <input type={typeCfPass ? "text" : "password"}
                           className='form-control'
                           id='cf_password'
                           name='cf_password'
                           value={cf_password}
                           onChange={handleChangeInput}
                           placeholder="请确认您刚才输入密码"
                    />
                    <small onClick={() => setTypeCfPass(!typeCfPass)}>
                        {typeCfPass ? '隐藏' : '显示'}
                    </small>
                </div>
            </div>
            <button disabled={isLogin === 'true'} type="submit" className='btn btn-dark w-100 my-1'>
                注册
            </button>
        </form>
    );
};

export default RegisterForm;
