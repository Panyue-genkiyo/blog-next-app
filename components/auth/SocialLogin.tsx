import React, {useLayoutEffect, useEffect} from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login-lite';
import { gapi } from "gapi-script";
import { FacebookLogin, FacebookLoginAuthResponse } from 'react-facebook-login-lite';
import { googleLogin, facebookLogin } from "../../features/auth";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";

//google/facebook账号登入
const SocialLogin = () => {
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector(state => state);
    const onGoogleLoginSuccess = (googleUser: GoogleLoginResponse) => {
        const id_token = googleUser.getAuthResponse().id_token;
        dispatch(googleLogin(id_token));
    }

    const onFacebookLoginSuccess = (facebookLoginAuthResponse: FacebookLoginAuthResponse) => {
        const { accessToken, userID } = facebookLoginAuthResponse.authResponse;
        dispatch(facebookLogin(accessToken, userID));
    }

    useLayoutEffect(() => {
        const image = document.querySelector('#fb-login img') as HTMLImageElement;
        image.src = '/facebook.png';
    }, [])

    useEffect(() => {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                clientId: '261918664418-ba8qg8mdbuuljkhj7vqp8oo9lucsju0u.apps.googleusercontent.com',
                plugin_name: "chat"
            })
        });
    }, [])

    return (
        <>
            <div className="my-2">
                <GoogleLogin
                    client_id='261918664418-ba8qg8mdbuuljkhj7vqp8oo9lucsju0u.apps.googleusercontent.com'
                    cookiepolicy='single_host_origin'
                    onSuccess={onGoogleLoginSuccess}
                    theme={theme ? 'dark' : 'light'}
                    longtitle={true}
                    isSignedIn={false}
                    height={50}
                />
            </div>
            <div className='my-2'>
                <FacebookLogin
                    appId="494241998812657"
                    onSuccess={onFacebookLoginSuccess}
                    theme='dark'
                />
            </div>
        </>
    );
};

export default SocialLogin;
