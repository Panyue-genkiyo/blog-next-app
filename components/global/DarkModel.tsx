import React  from 'react';
import DarkModeToggle from 'react-dark-mode-toggle';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import { setTheme } from "../../features/theme";


const DarkModel = () => {

    const { theme } = useAppSelector(state => state);
    const dispatch = useAppDispatch();

    return (
        <DarkModeToggle
            onChange={() => dispatch(setTheme(!theme))}
            checked={theme}
            size={80}
            speed={2}
        />
    );
};

export default DarkModel;
