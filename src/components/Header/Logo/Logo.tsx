import React from 'react';
import s from './Logo.module.scss';
import logo from '../../../assets/images/logo.png';
import {NavLink} from "react-router-dom";

export const Logo = () => {
    return (
        <div className={s.logoWrapper}>
            <NavLink to={'/'}>
                <img src={logo} alt="logo"/>
            </NavLink>
        </div>
    );
};