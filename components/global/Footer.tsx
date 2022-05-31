import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../hooks/redux-hooks";
import useTheme from "../../hooks/util-hooks/useTheme";


const Footer = () => {
    const { isSSGRTheme } = useTheme()

    return (
        <div className={`text-center bg-light py-4 ${isSSGRTheme && 'footer-night'}`}>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <h6>欢迎来到pan's社群博客分享平台</h6>
            <a
                href="https://github.com/Panyue-genkiyo/blog-app-client"
                target='_blank' rel='noreferrer'
                className='mb-2 d-block'
            >
                项目源码
            </a>
            <p>CopyRight &copy; 2022</p>
        </div>
    );
};

export default Footer;
