import React from 'react';
import s from './Footer.module.scss';

export const Footer = () => {
    return (
        <div className={s.footerWrapper}>
            <p className={s.copyRight}>Copyright 2023</p>
        </div>
    );
};