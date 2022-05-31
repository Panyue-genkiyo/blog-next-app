import React, {useState} from 'react';
import { forgotPassword } from "../features/auth";
import {FormSubmit} from "../types/globalTypes";
import useCheckIfLoggedIn from "../hooks/util-hooks/useCheckIfLoggedIn";
import {useAppDispatch} from "../hooks/redux-hooks";


const ForgotPassword = () => {

    const [account, setAccount] = useState('');
    const dispatch = useAppDispatch();
    const { isLogin } = useCheckIfLoggedIn();

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault();
        dispatch(forgotPassword(account));
    }


    return (
        <div className='my-4' style={{ maxWidth: '500px' }}>
            <h2>忘记密码</h2>
            <form className="form-group" onSubmit={handleSubmit}>
                <label htmlFor='account'>邮箱</label>
                <div className="d-flex align-items-center">
                    <input type="text"
                           className='form-control'
                           id='account' name='account'
                           value={account}
                           onChange={(e) => setAccount(e.target.value)}
                           disabled={isLogin === 'true'}
                    />
                    <button disabled={isLogin === 'true'} className='btn btn-primary mx-2 d-flex align-items-center' type="submit">
                        <i className='fa fa-paper-plane me-2'/> <span style={{ minWidth: 'max-content' }}>发送</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
