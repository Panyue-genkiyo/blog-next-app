import {IBlog} from '../globalTypes';

interface IHomeBlogs {
   _id: string,
   name: string,
   "count": number,
   blogs: IBlog[],
}

export interface HomeBlogs{
   blogs: IHomeBlogs[],
   page: number,
   hasMore: boolean,
}

export interface IBlogsUser {
   id:string,
   blogs:IBlog[],
   total: number,
}

export interface IBlogsCategory {
   id:string,
   blogs:IBlog[],
   total: number,
}



