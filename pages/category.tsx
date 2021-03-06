import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useModals } from "@mantine/modals";
import { Text } from '@mantine/core';
import {FormSubmit, ICategory} from "../types/globalTypes";
import NotFound from "../components/global/NotFound";
import {useQueryClient} from "react-query";
import {useAddCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation} from "../hooks/rq-hooks/useCategories";
import { categoriesData } from "../types/rq-types/categoryTypes";
import CategorySkeleton from "../components/skeletons/CategorySkeleton";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {setAlert} from "../features/alert";


const Category = () => {

    const [name, setName] = useState('');
    const [edit, setEdit] = useState<ICategory | null>(null);
    const { auth, theme } = useAppSelector( state => state);
    const dispatch = useAppDispatch();
    const modal = useModals();
    const queryClient = useQueryClient();
    const { mutate: addCategoryMutate } = useAddCategoryMutation();
    const { mutate: deleteCategoryMutate } = useDeleteCategoryMutation();
    const { mutate: updateCategoryMutate } = useUpdateCategoryMutation();
    const cd = queryClient.getQueryData<categoriesData>('categories');
    const num = queryClient.isFetching(['refreshToken']);


    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault();
        if(!auth?.access_token || !name) return;
        if(edit) {
            if(edit.name === name) {
                setEdit(null);
                setName('');
                return;
            }
            if(cd?.categories.some(item => item.name === name)) {
                return dispatch(setAlert({ errors: `${name}已存在`, isShow: true }))
            }
            const data = {...edit, name};
            updateCategoryMutate({ updateCategory: data, dispatch, token: auth.access_token});
        }else{
            addCategoryMutate({newCategoryName: name, token: auth.access_token, dispatch});
        }
        setName('');
        setEdit(null);
    }

    const handleDelete = (id: string ) => {
        if(!auth.access_token) return;
        modal.openConfirmModal({
            title: '删除这个分类?',
            centered: true,
            zIndex: 5002,
            children: (
                <Text size='sm'>
                    你确定要删除你的这个分类吗？这个行为是破坏性的，你将无法恢复该分类
                </Text>
            ),
            labels: {
                confirm: '删除',
                cancel: '取消'
            },
            confirmProps: {
                color: 'red'
            },
            onConfirm: () => {
                deleteCategoryMutate({categoryId: id, token: auth.access_token as string, dispatch});
            }
        })
    }


    useEffect(() => {
        if(edit) setName(edit.name);
    },[edit])

    if(!cd || num === 1) return <CategorySkeleton/>

    if(auth.user?.role !== 'admin') return <NotFound/>

    return (
        <>
            <Head>
                <title>分类</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`category ${theme && 'category-night'}`}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='category'>博客分类</label>
                    <div className="d-flex align-items-center">
                        {
                            edit && <i className='fas fa-times me-2 text-danger' style={{ cursor: 'pointer' }} onClick={() => setEdit(null)}/>
                        }
                        <input type="text" name="category" id="category"
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                        />
                        <button type="submit" disabled={!name}>{edit ? '更新分类' : '创建分类'}</button>
                    </div>
                </form>
                <div >
                    {
                        cd?.categories.map(category => (
                            <div key={category._id} className="category_row">
                                <p className="m-0 text-capitalize">
                                    {category.name}
                                </p>
                                <div>
                                    <i className='fas fa-edit mx-2' onClick={() => setEdit(category)}/>
                                    <i className='fas fa-trash-alt text-danger' onClick={() => handleDelete(category._id)}/>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
};

export default Category;
