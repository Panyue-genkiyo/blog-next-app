import {useCallback, useEffect, useRef} from "react";

interface IProps{
    timer: NodeJS.Timer | null;
    fn: Function
}
export default function useDebounce(fn:Function, delay?: number, dep: any[] = []) {
    const { current } = useRef<IProps>({ fn, timer: null });
    useEffect(function () {
        current.fn = fn;
    }, [fn]);

    return useCallback(function f(...args: any) {
        if (current.timer) {
            clearTimeout(current.timer);
        }
        current.timer = setTimeout(() => {
            current.fn(...args);
        }, delay);
    }, dep)
}
