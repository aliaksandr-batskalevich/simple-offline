import React from 'react';
import s from './Error.module.scss';
import errorLogo from '../../../assets/images/logo-error.png';

export const Error = () => {
    return (
        <div className={s.errorWrapper}>
            <h2>404: Page not found</h2>
            <div className={s.errorLogoWrapper}>
                <img src={errorLogo} alt="errorLogo"/>
            </div>
        </div>
    );
};