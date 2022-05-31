import React, {useEffect, useRef} from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useClickOutside } from '@mantine/hooks';
import Search from "./Search";
import Menu from "./Menu";
import DarkModel from "./DarkModel";
import useTheme from "../../hooks/util-hooks/useTheme";

const Header = () => {
    const menuRef = useRef<null | HTMLDivElement>(null);
    const { pathname } = useRouter();
    const navRef = useClickOutside(() => {
        if(menuRef?.current?.classList.contains('show')){
            menuRef.current.classList.remove('show');
        }
    })
    const { isSSGRTheme } = useTheme();
    useEffect(() => {
        //防止页面跳转时还是打开
        if(!menuRef?.current?.classList.contains('show')) return;
        menuRef.current?.classList.remove('show');
    }, [pathname])

    useEffect(() => {
       const btn = document.querySelectorAll('button')[1];
       if(!btn) return;
       if(btn.classList.contains('mode-toggle')) return;
       btn.classList.add('mode-toggle');
    },[]);


    return (
        <nav className={`navbar navbar-expand-lg navbar-light bg-light p-3 ${isSSGRTheme && 'header-night'}`} style={{ position: 'sticky', top: 0, left: 0, zIndex: 1000 }} ref={navRef}>
            <Link href="/" passHref>
                <a className="navbar-brand logo-brand">社群博客平台</a>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <DarkModel/>
            <div className='ml-3 collapse navbar-collapse' ref={menuRef} id="navbarNav">
                <Search />
                <Menu targetMenu={menuRef}/>
            </div>
        </nav>
    );
};

export default Header;
