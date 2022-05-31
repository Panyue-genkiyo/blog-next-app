//判断ssr ssg 防止水和错误

import {useAppSelector} from "../redux-hooks";
import {useEffect, useState} from "react";

const useTheme = () => {
    const { theme } = useAppSelector(state => state);
    const [isSSGRTheme, setIsSSGTheme] =  useState(false);
    useEffect(() => {
        setIsSSGTheme(theme);
    }, [theme])
    return { isSSGRTheme };
}

export default useTheme;
