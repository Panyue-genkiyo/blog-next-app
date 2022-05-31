export const checkImage = (file: File) => {
    const types = ["image/png", "image/jpeg", "image/jpg"];
    let err = '';
    if(!file) return err = "文件不存在";
    if(file.size > 1024 * 1024 * 3) return err = "图片大小不能超过3M";
    if(!types.includes(file.type)) return err = "图片格式不正确，只接受jpg、png、jpeg格式";
    return err;
}


export default async function imageUpload(file:File){
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'z0hqsztj');
    formData.append('cloud_name', 'pyshiori');
    const res = await fetch('https://api.cloudinary.com/v1_1/pyshiori/upload',{
        method: "POST",
        body: formData,
    });
    const data = await res.json();
    return { public_id: data.public_id, url: data.secure_url };
}

