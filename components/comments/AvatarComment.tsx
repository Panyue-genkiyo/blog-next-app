import React from 'react';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import {IUser} from "../../types/globalTypes";

interface IProps{
    user: IUser,
}

const AvatarComment: React.FC<IProps> = ({ user }) => {

    return (
        <div className='avatar_comment'>
            <img src={user.avatar} alt='avatar'/>
            <small className='d-block text-break'>
                <Link href={`/profile/${user._id}`}>{user.name}</Link>
            </small>
        </div>
    );
}

export default AvatarComment;
