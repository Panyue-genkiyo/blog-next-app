import { ICategory, tokenAndDispatch } from "../globalTypes";

export interface addCategoryParams extends tokenAndDispatch {
    newCategoryName: string;
}

export interface deleteCategoryParams extends tokenAndDispatch {
    categoryId: string;
}

export interface updateCategoryParams extends tokenAndDispatch {
    updateCategory: ICategory;
}

export interface categoriesData{
    categories: ICategory[]
}
