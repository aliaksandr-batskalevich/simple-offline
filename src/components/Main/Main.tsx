import React from 'react';
import s from './Main.module.scss';
import {AppRoutes} from "../../routes/Routes";

export const Main = () => {
    return (
        <div className={s.mainWrapper}>
            <AppRoutes/>
        </div>
    );
};