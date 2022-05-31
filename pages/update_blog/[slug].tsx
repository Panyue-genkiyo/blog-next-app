import React from 'react';
import { useRouter } from "next/router";
import CreateBlog from "../create_blog";

const UpdateBlog = () => {

    const router = useRouter();

    if(!router.query.slug) return null;

    return <CreateBlog id={router.query.slug as string}/>
};


export default UpdateBlog;
