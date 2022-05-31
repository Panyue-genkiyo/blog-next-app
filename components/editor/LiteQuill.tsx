import React from 'react';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';


interface IProps{
    body:string,
    setBody: (body: string) => void;
}

const ReactQuillEditor: React.FC<IProps> = ({body ,setBody }) => {

    const modules = {
        toolbar: {container}
    }


    const handleChange = (e: string) => {
        setBody(e)
    }


    return (
        <div>
            <ReactQuill
                theme='snow'
                modules={modules}
                onChange={handleChange}
                defaultValue={body}
            />
        </div>
    );
};

let container = [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
]

export default ReactQuillEditor;
