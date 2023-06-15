import React from 'react';
import s from './SideBar.module.scss';
import {NavLink} from "react-router-dom";

export const SideBar = () => {
    return (
        <div className={s.sideBarWrapper}>
            <NavLink to={'/profile'} className={s.profile}/>
            <NavLink to={'/users'} className={s.users}/>
        </div>
    );
};