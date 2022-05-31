import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {AppDispatch, RootState} from '../../features/store';

//封装常用的react-redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch | any>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
