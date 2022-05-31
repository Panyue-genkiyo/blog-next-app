import React from 'react';
import {Check, X} from "tabler-icons-react";
import {Modal} from "@mantine/core";
import Loading from "./Loading";
import MyNotification from "./MyNotification";
import ImageCrop from "../global/ImageCrop";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setAlert} from "../../features/alert";
//弹出层
export const Alert = () => {
    // const { alert } = useSelector((state: RootStore) => state);
    // const dispatch = useDispatch<Dispatch<IAlertType>>();
    const { alert } = useAppSelector(state => state)
    const dispatch = useAppDispatch();

    return (
        <div>
            { alert.loading && <Loading/>}
            { (alert.errors && alert.isShow) && (
                 <MyNotification id='error' icon={<X size={18}/>} message={alert.errors} isError={true}/>
            )}
            { alert.success && (
                <MyNotification id='success' icon={<Check size={18}/>} message={alert.success} isError={false}/>
            )}
            {
                alert.isModalOpen && (
                    <Modal
                        zIndex={9999}
                        opened={alert.isModalOpen}
                        onClose={() => {
                            dispatch(setAlert({
                                isModalOpen: false
                            }))
                        }}
                        title={alert.modalTitle}
                        centered
                        size='md'
                        overlayOpacity={0.55}
                        overlayBlur={3}
                    >
                        <ImageCrop
                            url={alert.imageUrl as string}
                            isProfileThumbnail={alert.isProfileThumbnail as boolean}
                            isCircle={alert.isCircle as boolean}
                            type={alert.picType}
                        />
                    </Modal>
                )
            }
        </div>
    );
};

export const showErrMsg = (msg: string) => {
    return (
        <div className='errMsg'>{msg}</div>
    )
};

export const showSuccessMsg = (msg: string) => {
    return (
        <div className='successMsg'>{msg}</div>
    )
};
