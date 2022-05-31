import React, {useEffect, useState, useRef, useMemo} from 'react';
// import LiteQuill from "../editor/LiteQuill";
import {IComment} from "../../types/globalTypes";
import {useAppSelector} from "../../hooks/redux-hooks";
import dynamic from "next/dynamic";

interface IProps {
    callback: (body: string) => void;
    edit?: IComment,
    setEdit? :(edit?: IComment) => void;
}

const LiteQuillSSR = dynamic(() => import('../editor/LiteQuill'), {ssr: false})

//评论框
const Input: React.FC<IProps> = ({ callback, edit, setEdit }) => {

    const [body, setBody] = useState('');
    const divRef = useRef<HTMLDivElement>(null);
    const { theme } = useAppSelector(state => state);

    useEffect(() => {
        if(edit) setBody(edit.content);
    },[edit])

    const handleSubmit = () => {
        const div = divRef.current;
        const text = (div?.innerText as string).trim();
        if(!text) {
            if(setEdit) return setEdit(undefined);
            return;
        }
        callback(body);
        setBody('');
    }

    let btnStyle = useMemo(() => {
        if(theme) return {
            background: '#5352ed',
            color: '#fff',
            fontWeight: 'bold'
        }
        return {}
    },[theme])


    useEffect(() => {
        const divs = document.querySelectorAll('.quill') as NodeListOf<HTMLDivElement>;
        if(!divs.length) return;
        if(theme) divs.forEach(div => div.classList.add('quill-night'));
        else divs.forEach(div => div.classList.remove('quill-night'));
    },[theme])

    return (
        <div>
            <LiteQuillSSR setBody={setBody} body={body}/>
            <div ref={divRef} dangerouslySetInnerHTML={{
                __html: body
            }} style={{ display: "none" }}/>
            <button className='btn btn-dark ms-auto d-block px-4 mt-2'  style={btnStyle} onClick={handleSubmit}>
                {edit ? '修改评论': '发布评论'}
            </button>
        </div>
    )
};

export default Input;
