import React from 'react';
import { Select } from '@mantine/core'
import useCustomRouter from "../../hooks/util-hooks/useCustomRouter";
import {useAppDispatch} from "../../hooks/redux-hooks";
import {setBlogCategoryLocation} from "../../features/userlocation";

interface IProps {
    page: number,
    sort: string,
    categoryId:string,
    blogSearchParams?:string,
    slug: string
}

const Sorting: React.FC<IProps> = ({page, sort, categoryId, slug}) => {

    const { pushQuery } = useCustomRouter();
    const dispatch =  useAppDispatch();

    const handleSort = (value: string) => {
        const sort = value;
        dispatch(setBlogCategoryLocation({
            page,
            sort,
            categoryId
        }))
        pushQuery({
            page,
            sort,
            slug
        })
    };


    return (
        <div>
            <Select
                label="排序"
                placeholder="选择一个排序"
                onChange={handleSort}
                value={sort}
                style={{ maxWidth: '30%'}}
                data={[
                    { value: 'createdAt', label: '最先发布' },
                    { value: '-createdAt', label: '最晚发布' },
                    { value: 'likes', label: '最多喜欢' },
                    { value: '-likes', label: '最少喜欢' },
                    { value: 'saved', label: '最多收藏' },
                    { value: '-saved', label: '最少收藏' },
                ]}
            />
        </div>
    );
};

export default React.memo(Sorting);
