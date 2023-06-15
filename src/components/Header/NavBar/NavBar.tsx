import React from 'react';
import {NavLink} from 'react-router-dom';
import s from './NavBar.module.scss';

export const NavBar = () => {
    return (
        <div className={s.navBarWrapper}>
            <NavLink
                to={'/profile'}
                className={({isActive}) => isActive ? s.active : ''}
            >PROFILE</NavLink>
            <NavLink
                to={'/users'}
                className={({isActive}) => isActive ? s.active : ''}
            >USERS</NavLink>
        </div>
    );
};