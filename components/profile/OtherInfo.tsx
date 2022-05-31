import React from 'react';
import { Skeleton } from "@mantine/core";
import {useOtherUser} from "../../hooks/rq-hooks/useUser";
import {showErrMsg} from "../alert/Alert";
import {useAppSelector} from "../../hooks/redux-hooks";

interface IProps {
    id?: string;
}

const OtherInfo: React.FC<IProps> = ({ id }) => {

    const { theme } = useAppSelector(state => state);
    const { data: other, isError, isLoading, error } = useOtherUser(id);

    if(isError) return showErrMsg((error as any).message);

    return (
        isLoading ? <Skeleton height={200} width={'100%'} className={`${theme && 'skeleton-night'}`}/> : <div className={`profile_info text-center ${theme && 'profile-info-night'}`}>
            <div className="info_avatar">
                <img src={other?.avatar} alt="avatar"/>
            </div>
            <div className='text-uppercase text-danger'>
                {other?.role}
            </div>
            <h6>
                昵称: <span className='text-info'>{other?.name}</span>
            </h6>
            <div>
                电话号码/邮箱
            </div>
            <span className="text-info">{other?.account}</span>
            <div>
                加入时期: <span style={{ color: '#ffc107' }}>{new Date(other?.createdAt).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default OtherInfo;
