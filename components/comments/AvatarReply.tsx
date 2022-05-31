import React from 'react'
// import { Link } from 'react-router-dom'
import Link from 'next/link';

import { IUser } from '../../types/globalTypes'

interface IProps {
    user: IUser
    reply_user?: IUser
}
const AvatarReply: React.FC<IProps> = ({ user, reply_user }) => {
    return (
        <div className="avatar_reply">
            <img src={user.avatar} alt="avatar" />

            <div className="ms-1">
                <small>
                    <Link href={`/profile/${user._id}`}
                          style={{ textDecoration: 'none' }}>
                        { user.name }
                    </Link>
                </small>

                <small className="reply-text">
                    回复 <Link href={`/profile/${reply_user?._id}`}>
                    { reply_user?.name }
                </Link>
                </small>
            </div>
        </div>
    )
}

export default AvatarReply
