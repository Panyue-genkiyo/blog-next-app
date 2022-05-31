import React, {RefObject } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { logout } from "../../features/auth";
import {useQueryClient} from "react-query";
import {Image, Skeleton} from "@mantine/core";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";


//菜单组件
interface MenuProps {
    targetMenu: RefObject<null | HTMLDivElement>
}

const Menu = ( { targetMenu }: MenuProps ) => {

    const { pathname } = useRouter();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const { auth, theme } = useAppSelector(state => state);
    const num = queryClient.isFetching('refreshToken');

    const isActive = (pn: string) => {
        if(pn === pathname) return 'active';
    }

    const bfLoginLinks = [
        { label: '登录', path: '/login' },
        { label: '注册', path: '/register' },
    ];

    const afLoginLinks = [
        { label: '主页', path: '/' },
        { label: '创作博客', path: '/create_blog' }
    ]

    //跳转链接关闭下拉菜单
    const handleAfterClickLinks = () => {
        if (targetMenu?.current?.classList.contains('show')) {
            targetMenu.current.classList.remove('show');
        }
    }

    const handleLogOut = () => {
        if(!auth.access_token) return;
        dispatch(logout(auth.access_token));
    }


    const navLinks = auth.access_token ? afLoginLinks : bfLoginLinks;


    return (
        <ul className="navbar-nav ms-auto">
            {
                num === 1 ? <Skeleton width={100} height={20} className={`link-skeleton ${theme && 'skeleton-night'}`}/> :
                navLinks.map((link, index) => (
                    <li key={index} className={`nav-item ${isActive(link.path)}`}>
                        <Link href={link.path} passHref>
                            <a  onClick={handleAfterClickLinks} className='nav-link'>{link.label}</a>
                        </Link>
                    </li>
                ))
            }

            {
                num !== 1 &&
                auth.user?.role === 'admin' && (
                    <li className={`nav-item ${isActive("/category")}`}>
                        <Link href='/category' passHref>
                            <a onClick={handleAfterClickLinks} className={'nav-link'}>分类</a>
                        </Link>
                    </li>
                )
            }


            {
                num === 1  ? (
                    <Skeleton  height={30} width={30} circle className={`avatar-skeleton ${theme && 'skeleton-night'}`}/>
                    ) :
                    (auth.user &&  <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={auth.user.avatar} alt="avatar" className={'avatar'}/>
                </span>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                        <Link href={`/profile/${auth.user._id}`} passHref>
                            <a onClick={handleAfterClickLinks} className="dropdown-item">个人主页</a>
                        </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <Link href="/"
                              passHref>
                            <a onClick={() => {handleAfterClickLinks();handleLogOut() }} className="dropdown-item">退出</a>
                        </Link>
                    </li>
                </ul>
            </li>)
            }

        </ul>
    );
};

export default Menu;
