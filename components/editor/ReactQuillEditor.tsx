import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import imageUpload, {checkImage} from '../../utils/imageUpload';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setAlert} from "../../features/alert";

interface IProps{
    setBody: (body: string) => void;
    body: string;
    id?: string;
}

let modules = {
     toolbar: [
         [{ 'font': [] }],
         [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
         [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

         ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
         ['blockquote', 'code-block'],
         [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
         [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript

         [{ 'list': 'ordered'}, { 'list': 'bullet' }],
         [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
         [{ 'direction': 'rtl' }],                         // text direction
         [{ 'align': [] }],

         ['clean', 'link', 'image','video']
     ]
}


const ReactQuillEditor: React.FC<IProps> = ({ setBody,body, id }) => {
    const quillRef = useRef<ReactQuill>(null);
    const { theme } = useAppSelector(state => state);
    const dispatch = useAppDispatch();

    const handleImageChange = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click()
        input.onchange = async () => {
            const files = input.files;
            if(!files) return dispatch(setAlert({ errors: '文件不存在'}));
            const file = files[0];
            const check = checkImage(file);
            if(check) return dispatch(setAlert({errors: check} ));
            dispatch(setAlert({ loading: true }))
            const photo = await imageUpload(file);
            const quill = quillRef.current;
            const range = quill?.getEditor().getSelection()?.index;
            if(range !== undefined) quill?.getEditor().insertEmbed(range, 'image', `${photo.url}`);
            dispatch(setAlert({success: '图片上传成功'}))
        }
    },[dispatch])

    //规范化图片
    useEffect(() => {
        const quill = quillRef.current;
        if(!quill) return;
        const toolbar = quill.getEditor().getModule('toolbar');
        toolbar.addHandler('image', handleImageChange)
    },[handleImageChange])

    useEffect(() => {
        const div = document.querySelector('.quill') as HTMLDivElement;
        if(!div) return;
        if(theme) div.classList.add('quill-night');
        else div.classList.remove('quill-night');
    },[theme])

    //到要修改时却没有body就返回null
    if(id && !body) return null;

    return (
        <div>
            <label>博客正文</label>
            <ReactQuill
                theme='snow'
                modules={modules}
                onChange={setBody}
                ref={quillRef}
                defaultValue={body}
            />
        </div>
    );
};


export default ReactQuillEditor;
