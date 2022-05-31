import axios from "axios";
import {API_URL} from "./config";
axios.defaults.withCredentials = true;

export const postAPI = async (url: string, post: object, token?:string) => {
    return await axios.post(`${API_URL}/api/${url}/`, post, {
        headers: {
            Authorization: `${token}`
        }
    });
}

export const getAPI = async ( url: string, token?: string) => {
       return await axios.get(`${API_URL}/api/${url}`, {
            headers: {
                Authorization: `${token}`
            },
        });
}

export const patchAPI = async ( url: string, changedUserFiled: object , token?: string) => {
    return await axios.patch(`${API_URL}/api/${url}`, changedUserFiled, {
        headers: {
            Authorization: `${token}`
        }
    });
}

export const putAPI = async ( url: string, changedUserFiled: object , token?: string) => {
    return await axios.put(`${API_URL}/api/${url}`, changedUserFiled, {
        headers: {
            Authorization: `${token}`
        }
    });
}

export const deleteAPI = async ( url: string, token?: string) => {
    return await axios.delete(`${API_URL}/api/${url}`, {
        headers: {
            Authorization: `${token}`
        }
    });
}
