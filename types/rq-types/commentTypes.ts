import { IComment, tokenAndDispatch } from "../globalTypes";
import {NextRouter} from "next/router";

export interface ICommentState{
    comments: IComment[],
    total: number,
}

export interface createCommentProps extends tokenAndDispatch{
    comment: IComment;
}

export interface useCommentsProps{
    id: string | undefined;
    limit?: number;
    page?: number;
}

export interface useCUDRCommentMutationProps extends createCommentProps, useCommentsProps{
    router?: NextRouter
}
