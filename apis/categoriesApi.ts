import { getAPI, postAPI, deleteAPI, patchAPI} from "../utils/fetchData";
import {checkTokenExpire} from "../utils/checkTokenExpire";
import { addCategoryParams, deleteCategoryParams, updateCategoryParams } from "../types/rq-types/categoryTypes";

export const fetchCategories = () => getAPI('category').then(res => res.data);

export const addCategory = async ({ newCategoryName, token, dispatch }: addCategoryParams) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    const { data } = await postAPI('category', { name: newCategoryName }, access_token);
    return data
}

export const deleteCategory = async ({ categoryId, token, dispatch }: deleteCategoryParams) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    return await deleteAPI(`category/${categoryId}`, access_token);
}

export const updateCategory = async ({ updateCategory, token, dispatch }: updateCategoryParams) => {
    const result = await checkTokenExpire(token, dispatch);
    const access_token = result ? result : token;
    let { data } = await patchAPI(
        `category/${updateCategory._id}` ,
        { name: updateCategory.name },
        access_token
    );
    return data;
}
