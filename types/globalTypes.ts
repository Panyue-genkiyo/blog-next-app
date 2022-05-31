import {ChangeEvent, FormEvent} from 'react';

import {useAppDispatch} from "../hooks/redux-hooks";

export type DispatchReturnType = ReturnType<typeof useAppDispatch>

export type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement >

export type FormSubmit = FormEvent<HTMLFormElement>

export interface tokenAndDispatch {
    token: string;
    dispatch: DispatchReturnType;
}

export interface IParams {
    page?: string,
    slug?: string,
}

export interface IUserLogin{
    account: string,
    password: string,
}

export interface IUserRegister extends IUserLogin{
    name: string;
    cf_password: string
}

export interface IUserProfile extends IUserRegister{
    avatar: string | File,
}

export interface IUser extends IUserLogin{
    _id: string,
    __v: number,
    avatar: string,
    createdAt: string,
    name: string,
    type: string,
    role: string
    updatedAt: string,
}

export interface IAlert{
    loading?:boolean,
    success?:string | string[],
    errors?:string | string[],
    isShow?: boolean,
    isModalOpen?: boolean,
    isProfileThumbnail?: boolean,
    imageUrl?: string | File,
    isCircle?: boolean,
    modalTitle?: string,
    picType?: 'thumbnail' | 'profileBlogThumbnail' | 'profilePic',
}

export interface ICategory{
    name: string,
    createdAt?: string,
    updatedAt?: string,
    _id: string,
}

export interface IBlog{
    _id?: string,
    user: string | IUser,
    title: string,
    content: string,
    description: string,
    category: string,
    thumbnail?: string | File,
    profileBlogThumbnail?: string | File,
    createdAt: string,
    updatedAt: string,
    likes: (IUser | string)[],
    saved: (IUser | string)[],
    savedLength: number,
    likesLength: number
}

export interface IComment{
    _id?: string,
    content: string,
    user: IUser,
    blog_id: string,
    blog_user_id: string,
    replyCM?: IComment[],
    reply_user?: IUser,
    comment_root?: string,
    createdAt: string,
}
