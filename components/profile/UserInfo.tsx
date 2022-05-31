import React, {useEffect, useState} from 'react';
import {InputChange, IUserProfile, FormSubmit} from '../../types/globalTypes'
import NotFound from "../global/NotFound";
import {useResetPasswordMutation, useUpdateUserInfoMutation} from "../../hooks/rq-hooks/useUser";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setAlert} from "../../features/alert";


const UserInfo = () => {

    const initState = {
        name:'',
        account:'',
        avatar:'',
        password:'',
        cf_password: '',
    }

    const { auth, theme, pic } = useAppSelector(state =>  state);
    const dispatch = useAppDispatch();
    const [ user, setUser ]  = useState<IUserProfile>(initState);
    const [ typePass, setTypePass ] = useState(false);
    const [ typeCfPass, setTypeCfPass ] = useState(false);
    const { mutate: updateUserMutate } = useUpdateUserInfoMutation();
    const { mutate: resetPasswordMutate, data  } = useResetPasswordMutation();

    const { name, avatar, password, cf_password } = user;


    useEffect(() => {
        if(pic.profilePic.file) setUser({...user, avatar: pic.profilePic.file})
    }, [pic.profilePic])

    const handleChangeInput = (e: InputChange) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleChangeFile = (e: InputChange) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if(files){
            const file = files[0];
            if(!file) return;
            dispatch(setAlert({
                isModalOpen: true,
                isCircle: true,
                isProfileThumbnail: false,
                imageUrl: URL.createObjectURL(file),
                picType: "profilePic"
            }))
        }
    }


    const handleSubmit = async (e: FormSubmit) => {
        e.preventDefault();
        if(!auth.access_token || !auth.user) return;
        if(avatar || name) {
            if(name === auth.user.name && (avatar === '')) return;
            updateUserMutate({
                token: auth.access_token,
                dispatch,
                avatar: avatar as File,
                name,
                user: auth.user,
                page: 1
            })
        }
        if(password) {
            resetPasswordMutate({
                 password,
                 cf_password,
                 dispatch,
                 token: auth.access_token
             });
            if(data !== false) {
                setUser(user => ({
                    ...user,
                    password: '',
                    cf_password: ''
                }))
            }
        }
    }

    if(!auth.user) return <NotFound/>

    return (
        <>
            <form className={`profile_info ${theme && 'profile-info-night'} `} onSubmit={handleSubmit}>
                <div className='info_avatar'>
                    <img src={avatar ? URL.createObjectURL(avatar as Blob) : auth.user.avatar} alt='avatar'/>isShow
                    <span>
                      <i className='fas fa-camera'/>
                      <p>更改</p>
                      <input type='file' accept='image/*'
                             name="file" id="file_up"
                             onClick={e => {
                                 (e as any).target.value = ''
                             }}
                             onChange={handleChangeFile}
                      />
                     </span>de
                </div>
                <div className='form-group my-3' >
                    <label htmlFor='name'>昵称</label>
                    <input type='text' className='form-control' id='name'
                           name='name'
                           defaultValue={auth.user.name}
                           onChange={handleChangeInput}
                    />
                </div>

                <div className='form-group my-3' >
                    <label htmlFor='account'>账号</label>
                    <input type='text' className='form-control' id='account'
                           name='account'
                           defaultValue={auth.user.account}
                           onChange={handleChangeInput}
                           disabled={true}
                    />
                </div>
                {
                    auth.user.type !== 'register' &&
                    <small className="text-danger">
                        *使用{auth.user.type}快速登录的账户无法修改密码*
                    </small>
                }
                <div className='form-group my-3'>
                    <label htmlFor='password'>密码</label>
                    <div className='pass'>
                        <input type={`${typePass ? "text" : "password"}`}
                               className='form-control' id='password'
                               name='password'
                               value={password}
                               onChange={handleChangeInput}
                               disabled={auth.user.type !== 'register'}
                        />
                        <small onClick={() => setTypePass(!typePass)}>
                            { typePass ? '隐藏' : '显示' }
                        </small>
                    </div>
                </div>

                <div className='form-group my-3'>
                    <label htmlFor='cf_password'>重复密码</label>
                    <div className='pass'>
                        <input type={`${typeCfPass ? "text" : "password"}`}
                               className='form-control' id='cf_password'
                               name='cf_password'
                               value={cf_password}
                               onChange={handleChangeInput}
                               disabled={auth.user.type !== 'register'}
                        />
                        <small onClick={() => setTypeCfPass(!typeCfPass)}>
                            { typeCfPass ? '隐藏' : '显示' }
                        </small>
                    </div>
                </div>

                <button className="btn btn-dark w-100" type="submit">
                    更新信息
                </button>
            </form>
        </>
    );
};

export default UserInfo;
