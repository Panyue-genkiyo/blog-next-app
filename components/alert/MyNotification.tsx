import React, { useEffect } from 'react';
import { showNotification } from "@mantine/notifications";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setAlert} from "../../features/alert";

interface IProps{
    id:string
    icon: JSX.Element,
    message: string | string[],
    isError: boolean,
}

const MyNotification: React.FC<IProps> = ({id, icon, message,isError }) => {

    const dispatch = useAppDispatch();
    const { alert } = useAppSelector(state => state);

    useEffect(() => {
        showNotification({
            id,
            color: isError ? 'red' : 'teal',
            icon,
            message: typeof message === 'string' ? message : (
                message.map((item, i) => (
                    <li key={i}>{item}</li>
                ))
            ),
            onClose() {
                if(alert.errors || alert.success || alert.isShow || alert.loading)
                dispatch(setAlert({}))
            }
        });
    },[icon, message, isError, id, dispatch])


    return (
        <>
        </>
    );
};

export default MyNotification;
