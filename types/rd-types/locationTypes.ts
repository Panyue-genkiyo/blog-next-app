interface UserLocationParamsType{
    home: number;
    save: number;
    like: number;
    now: 'home' | 'like' | 'save'
}


interface BlogsCategoryType{
    page: number;
    sort: string;
}

export interface BlogCategoryPagePayLoadType{
    categoryId: string;
    page: number;
    sort: string;
}

export interface BlogCommentsPagePayLoadType{
    blogId: string;
    page: number;
}

export interface UserPagePayLoadType{
    userId: string;
    page: number;
    target: 'home' | 'save' | 'like';
}

export interface UserNowPayLoadType{
    userId: string,
    now: 'home' | 'like' | 'save'
}


export interface UserLocationStateType{
    user: {
        [key: string]: UserLocationParamsType;
    },
    comments: {
        [key: string]: number
    },
    bc:{
        [key: string]: BlogsCategoryType
    }
}

