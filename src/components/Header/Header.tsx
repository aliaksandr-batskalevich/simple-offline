import React from 'react';
import s from './Header.module.scss';
import {NavBar} from "./NavBar/NavBar";
import {Logo} from "./Logo/Logo";
import {ConnectionIndicator} from "../../offlineMode/components/ConnectionIndicator/ConnectionIndicator";

export const Header = () => {
    return (
        <div className={s.headerWrapper}>
            <Logo/>
            <NavBar/>
            <ConnectionIndicator/>
        </div>
    );
};