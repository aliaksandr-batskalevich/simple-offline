import React from 'react';
import s from './Header.module.scss';
import {NavBar} from "./NavBar/NavBar";
import {Logo} from "./Logo/Logo";

export const Header = () => {
    return (
        <div className={s.headerWrapper}>
                <Logo/>
                <NavBar/>
        </div>
    );
};