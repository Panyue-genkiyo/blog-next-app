import React, {useCallback, useState} from 'react';
import Cropper from "react-easy-crop";
import {Button, Slider} from "@mantine/core";
import getCroppedImg from "../../utils/cropImage";
import {Upload, X} from "tabler-icons-react";
import {useAppDispatch} from "../../hooks/redux-hooks";
import {setProfileBlogThumbnail, setProfilePic, setThumbnail} from "../../features/picFile";
import {setAlert} from "../../features/alert";


interface ImageIProps{
    url: string,
    isCircle: boolean,
    isProfileThumbnail: boolean,
    type: 'thumbnail' | 'profileBlogThumbnail' | 'profilePic' | undefined ,
}

interface CroppedImageProps{
    file: File,
    url: string,
}


const ImageCrop: React.FC<ImageIProps> = ({url, isCircle, isProfileThumbnail, type}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState<CroppedImageProps | null>(null)
    const dispatch = useAppDispatch();

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                url,
                croppedAreaPixels,
                rotation,
            )
            setCroppedImage(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels, rotation])

    const handleUpload = (file?: File) => {
        if(file && type && url){
            let f = new File([file], file.name, {type: file.type});
            switch (type) {
                case 'profilePic':
                    dispatch(setProfilePic({
                        file,
                        url
                    }))
                    break;
                case 'profileBlogThumbnail':
                    dispatch(setProfileBlogThumbnail({
                        file,
                        url
                    }))
                    break;
                case 'thumbnail':
                    dispatch(setThumbnail({
                        file,
                        url
                    }))
            }
            dispatch(setAlert({
                isModalOpen: false
            }))
        }
    }

    return (
        <>
            <div className='cropper'>
                <Cropper
                    image={url}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={isCircle ? 1 : isProfileThumbnail ? 3 / 4 : 16 / 9 }
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div className='slider'>
                <div>
                    <label>缩放-移位</label>
                    <Slider
                        value={zoom}
                        label={'zoom'}
                        max={3}
                        min={1}
                        step={0.1}
                        onChange={(zoom) => {
                            setZoom(zoom)
                        }}
                    />
                </div>
                <div>
                    <label>旋转</label>
                    <Slider
                        value={rotation}
                        label={'rotation'}
                        min={0}
                        max={360}
                        step={1}
                        aria-labelledby="Rotation"
                        onChange={( rotation) => {
                            setRotation(rotation)
                        }}
                    />
                </div>
            </div>
            <div className='crop-btn'>
                <Button
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    onClick={showCroppedImage}
                >
                    点击查看结果
                </Button>
            </div>
            {
                croppedImage && (
                    <div className='viewer'>
                        <div>
                            <img src={croppedImage.url} alt="Cropped" className='output'/>
                        </div>
                        <div className='btn-group'>
                            <Button
                                variant="outline"
                                leftIcon={<Upload/>}
                                onClick={() => handleUpload(croppedImage?.file)}
                            >
                                上传
                            </Button>
                            <Button
                                variant="gradient"
                                gradient={{ from: 'red', to: '#d63031', deg: 35 }}
                                leftIcon={<X/>}
                                onClick={() => setCroppedImage(null)}
                            >
                                取消
                            </Button>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default ImageCrop;
