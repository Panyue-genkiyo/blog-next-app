import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    addCategoryParams,
    categoriesData,
    deleteCategoryParams,
    updateCategoryParams
} from "../../types/rq-types/categoryTypes";
import {
    fetchCategories,
    deleteCategory,
    updateCategory,
    addCategory
} from '../../apis/categoriesApi';
import {setAlert} from "../../features/alert";


export const useCategories = () => {
    return useQuery<categoriesData>(
        ['categories'],
        fetchCategories,
        {
            staleTime: Infinity,
        }
    );
};

export const useAddCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(addCategory, {
        onMutate: async ({newCategoryName}: addCategoryParams) => {
            await queryClient.cancelQueries(['categories']);
            let previousData = await queryClient.getQueryData<categoriesData>(['categories']);
            if(previousData){
                previousData.categories.push({
                    _id: Date.now().toString(),
                    name: newCategoryName
                });
                queryClient.setQueryData(['categories'], previousData);
            }
            return {
                previousData,
            }
        },
        onError: (err:any, {dispatch}: addCategoryParams, ctx) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            queryClient.setQueryData(['categories'],ctx?.previousData)
        },
        onSettled: async (_res, _error, params, _ctx ) => {
            await queryClient.invalidateQueries(['categories']);
        }
    })
}

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteCategory, {
        onMutate: async ({ categoryId }: deleteCategoryParams) => {
            await queryClient.cancelQueries(['categories']);
            const previesCatgories = await queryClient.getQueryData<categoriesData>(['categories']);
            if (previesCatgories) {
                const newCategories = previesCatgories.categories.filter(category => category._id !== categoryId);
                queryClient.setQueryData(['categories'], {categories: newCategories});
            }
            return { previesCatgories };
        },
        onError: (err: any, {dispatch}: deleteCategoryParams, ctx:any) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            if(ctx.previesCatgories){
                queryClient.setQueryData(['categories'],  ctx.previesCatgories);
            }
        },
    })
}

export const useUpdateCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(updateCategory, {
        onMutate: async ({ updateCategory } : updateCategoryParams) => {
            await queryClient.cancelQueries(['categories']);
            const previousCategories = await queryClient.getQueryData<categoriesData>(['categories']);
            if(previousCategories){
                const newCategories = previousCategories.categories.map(category => {
                    if(category._id === updateCategory._id){
                        return updateCategory;
                    }
                    return category;
                });
                queryClient.setQueryData(['categories'], {categories: newCategories});
            }
            return { previousCategories };
        },
        onError: (err: any, {dispatch}: updateCategoryParams, ctx:any) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            if(ctx.previousCategories){
                queryClient.setQueryData(['categories'],  ctx.previousCategories);
            }
        },
        onSettled:() => {
            queryClient.invalidateQueries(['homeBlogs']);
        }
    })
}


