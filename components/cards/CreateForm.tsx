import React, {useEffect} from 'react';
import { useQueryClient } from "react-query";
import { IBlog, InputChange } from '../../types/globalTypes'
import { categoriesData } from "../../types/rq-types/categoryTypes";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setProfileBlogThumbnail, setThumbnail} from "../../features/picFile";
import {setAlert} from "../../features/alert";

interface IProps {
    blog: IBlog,
    setBlog: (blog: IBlog) => void,
}


const CreateForm: React.FC<IProps> = ({ blog,setBlog }) => {

    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()
    const { theme,  pic } = useAppSelector(state => state);
    const cd = queryClient.getQueryData<categoriesData>('categories');


    useEffect(() => {
        if(pic.thumbnail.file) {
            setBlog({...blog, thumbnail: pic.thumbnail.file});
        }
        return () => {
            if(pic.thumbnail.file)
                dispatch(setThumbnail({
                    file: null,
                    url: pic.thumbnail.url
                }))
        }
    }, [pic.thumbnail])


    useEffect(() => {
        if(pic.profileBlogThumbnail.file) {
            setBlog({...blog, profileBlogThumbnail: pic.profileBlogThumbnail.file});
        }
        return () => {
            if(pic.profileBlogThumbnail.file){
                dispatch(setProfileBlogThumbnail({
                    file: null,
                    url: pic.profileBlogThumbnail.url
                }))
            }
         }
    }, [pic.profileBlogThumbnail])



    const handleChangeInput = (e: InputChange) => {
        const { value, name } = e.target;
        setBlog({ ...blog, [name]: value });
    }

    const handleChangeThumbnail = (e: InputChange) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if(files) {
            const file = files[0];
            if(!file) return;
            dispatch(setAlert({
                isModalOpen: true,
                isCircle: false,
                isProfileThumbnail: false,
                modalTitle: '??????????????????????????????',
                imageUrl: URL.createObjectURL(file),
                picType: 'thumbnail'
            }))
        }
    }


    const handleChangeProfileThumbnail = (e: InputChange) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if(files) {
            const file = files[0];
            if(!file) return;
            dispatch(setAlert({
                isModalOpen: true,
                isCircle: false,
                isProfileThumbnail: true,
                modalTitle: '????????????????????????????????????',
                imageUrl: URL.createObjectURL(file),
                picType: 'profileBlogThumbnail'
            }))
        }
    }

    return (
        <>
            <form className={`${theme && 'create-form-night'}`}>
                <div className={`form-group position-relative`}>
                    <label htmlFor='title'>????????????</label>
                    <input type="text" className='form-control'
                           value={blog.title}
                           onChange={handleChangeInput}
                           name={"title"}
                           id={'title'}
                    />
                    <small className="text-muted position-absolute"
                           style={{ bottom: 0, right:'3px', opacity: '0.5' }}
                    >
                        {
                            blog.title.length >= 5 ?
                                ( blog.title.length <= 50 ? `5<=${blog.title.length}<=50`:  <span style={{color: 'red'}}>{blog.title.length}&gt;50(????????????50??????????????????{blog.title.length-50}?????????)</span>)
                                : <span style={{color: 'red'}}>{blog.title.length}/5 (????????????5??????????????????{5-blog.title.length}?????????)</span>
                        }
                    </small>
                </div>
                <div className="form-group my-3">
                    <label htmlFor='profileBlogThumbnail'>??????????????????????????????</label>
                    <input
                        type="file"
                        id='profileBlogThumbnail'
                        className='form-control'
                        onClick={e => {
                            (e as any).target.value = ''
                        }}
                        onChange={handleChangeProfileThumbnail}
                        accept="image/*"
                    />
                </div>
                <div>
                    <label htmlFor='thumbnail'>?????????????????????</label>
                    <input
                        type="file"
                        id='thumbnail'
                        className='form-control'
                        onChange={handleChangeThumbnail}
                        onClick={e => {
                            (e as any).target.value = ''
                        }}
                        accept="image/*"
                    />
                </div>
                <div className="form-group position-relative">
                    <label htmlFor='description'>????????????</label>
                    <textarea className='form-control'
                              id='description'
                              value={blog.description}
                              style={{ resize: "none" }}
                              rows={4}
                              name='description'
                              onChange={handleChangeInput}
                    />
                    <small className="text-muted position-absolute"
                           style={{ bottom: 0, right:'3px', opacity: '0.5' }}
                    >
                        {
                            blog.description.length >= 10 ?
                                ( blog.description.length <= 200 ? `10<=${blog.description.length}<=200`:  <span style={{color: 'red'}}>{blog.description.length}&gt;200(????????????200??????????????????{blog.description.length-200}?????????)</span>)
                                : <span style={{color: 'red'}}>{blog.description.length}/10 (????????????10??????????????????{10-blog.description.length}?????????)</span>
                        }
                    </small>
                </div>
                <div className="form-group my-3">
                    <label htmlFor='category'>??????</label>
                    <select className="form-control text-capitalize"
                            value={blog.category}
                            name='category'
                            onChange={handleChangeInput}
                            id='category'
                    >
                        <option value="">????????????</option>
                        {
                            cd?.categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
            </form>
        </>
    );
};

export default CreateForm;
