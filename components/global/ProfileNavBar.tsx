import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setUserNow} from "../../features/userlocation";

interface IProps{
    slug: string
}

const ProfileNavBar: React.FC<IProps> = ({slug}) => {

    const [active, setActive] = useState('');
    const { userLocation } = useAppSelector(state => state);
    const dispatch = useAppDispatch();

    const lc = userLocation['user'][slug] && userLocation['user'][slug].now

    const links = [
        { to: 'home', icon: <i className="fas fa-home"/> },
        { to: 'like', icon: <i className="fas fa-heart"/> },
        { to: 'save', icon: <i className="fas fa-bookmark"/>}
    ]

    useEffect(() => {
        console.log({active, lc});
        if(!active) {
            setActive(lc ? lc : 'home')
            dispatch(setUserNow({
                userId: slug,
                now: lc ? lc : 'home'
            }))
        } else if(active !== lc){
            dispatch(setUserNow({
                userId: slug,
                now: active as 'home' | 'like' | 'save'
            }))
        }
    }, [lc, slug, active])


    return (
        <ul className="nav nav-pills nav-fill">
            {
                links.map((l, index) => (
                    <li className="nav-item" key={index} onClick={() => setActive(l.to)}>
                        <span className={`nav-link ${l.to === active && 'active'}`}>
                            {l.icon}
                        </span>
                    </li>
                ))
            }
        </ul>
    );
};

export default ProfileNavBar;
