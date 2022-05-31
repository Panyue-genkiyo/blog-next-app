import {IUserRegister, IBlog} from "../types/globalTypes";

//检查邮箱格式
export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

//检查电话号码格式
export const validatePhone = (phone: string) => {
    //中国手机号
    return (/^1[0-9]{10}$/).test(phone);
};

export const validRegister = (userRegister: IUserRegister) => {
    const { name, account, password, cf_password  } = userRegister;
    const errors: string[] = [];
    if(!name){
        errors.push('请添加昵称')
    }else if(name.length > 20){
        errors.push('昵称不能超过20个字符');
    }

    if(!account){
        errors.push('请添加账号(邮箱或手机号)')
    }else if(!validateEmail(account) && !validatePhone(account)){
        errors.push('请添加正确的邮箱或手机号',)
    }


     const msg= checkPassword(password, cf_password);
     if(msg) errors.push(msg);

     return {
        errMsg: errors,
        errLength: errors.length
     }
}

export const checkPassword = (password: string, cf_password: string) => {
     if(password.length < 6) return "密码不能少于6位";
     else if(password !== cf_password) return "两次密码不一致";
     else return "";
}


//博客标题，内容验证
export const validCreateBlog = ({ title, content, description, thumbnail, category, profileBlogThumbnail } : IBlog) => {
    const errors: string[] = [];

    if(title?.trim().length < 5){
        errors.push('标题不能少于5个字符');
    }else if(title.trim().length > 50){
        errors.push('标题不能超过50个字符');
    }

     if(content?.trim().length < 20) {
         errors.push('内容不能少于20个字符');
     }

     if(description?.trim().length < 10) {
         errors.push('描述不能少于10个字符');
     }else if(description?.trim().length > 200) {
         errors.push('描述不能超过200个字符');
     }

     if(!category) {
         errors.push('请选择分类');
     }

     return {
         errMsg: errors,
         errLength: errors.length
     }

}


// Shallow equality
// Shallow equality
export const shallowEqual = (object1: any, object2: any) => {
    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)

    if(keys1.length !== keys2.length) {
        return false;
    }

    for(let key of keys1) {
        if(object1[key] !== object2[key]){
            return false;
        }
    }

    return true;

}
