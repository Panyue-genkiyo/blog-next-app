import { tokenAndDispatch, IBlog } from "../globalTypes";
import { NextRouter } from "next/router";

export  interface likeSaveCURDBlogParams extends tokenAndDispatch{
    blog: IBlog;
    userId: string,
    isLike?: boolean,
    isSave?: boolean,
    likes?: number,
    saved?: number,
    initialLikes?: number,
    initialSaved?: number,
    router?: NextRouter,
    name?: string,
}

export interface blogCategoryParams{
    search?: string,
    page?: number,
    sort?: string,
    categoryId?: string,
}
