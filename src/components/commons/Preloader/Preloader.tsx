import React from "react";
import s from './Preloader.module.scss'
import preloader from '../../../assets/images/spinnerPreloader.gif';

export const Preloader = () => {
    return (
        <div className={s.preloaderWrapper}>
            <img src={preloader} alt="preloader"/>
        </div>
    )
}