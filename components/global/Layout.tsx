import React, { useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import io from 'socket.io-client';
import SocketClient from "../socket/SocketClient";
import {logout} from "../../features/auth";
import {API_URL} from '../../utils/config'
import {useCategories} from "../../hooks/rq-hooks/useCategories";
import {Alert} from '../alert/Alert';
import Fixation from "../global/Fixation";
import {useRefreshToken} from "../../hooks/rq-hooks/useAuth";
import SocketClientHome from "../socket/SocketClientHome";
import SocketClientCBHome from "../socket/SocketClientCBHome";
import SocketClientProfileHome from "../socket/SocketClientProfileHome";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setSocket} from "../../features/socket";

interface IProps{
    children: JSX.Element
}

const Layout: React.FC<IProps> = ({ children }) => {

    const dispatch = useAppDispatch();
    const logged = typeof localStorage !== 'undefined' && localStorage.getItem('logged');
    const { auth, theme } = useAppSelector(state => state);
    const { data: userData } = useRefreshToken({dispatch, token: ''});

    useCategories();
    useEffect(() => {
        const socket = io(API_URL);
        dispatch(setSocket(socket));
        return () => {
            socket.close();
        }
    }, [dispatch]);


    useEffect(() => {
        const html = document.querySelector('html') as HTMLElement;
        theme ? html.classList.add('index-night') : html.classList.remove('index-night');
    }, [theme])

    useEffect(() => {
        if(!logged && auth.access_token && userData) {
            dispatch(logout(auth.access_token));
        }else if(logged && !auth.access_token && !userData) {
            localStorage.setItem('isFirst', 'false');
        }
    }, [userData, dispatch, logged]);


    return (
        <div className='container'>
            <SocketClientProfileHome/>
            <SocketClientCBHome/>
            <SocketClientHome/>
            <SocketClient/>
            <Alert/>
            <Header/>
            {children}
            <Fixation/>
            <Footer/>
        </div>
    );
};

export default Layout;
