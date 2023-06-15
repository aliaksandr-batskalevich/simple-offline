import React from 'react';
import s from './Main.module.scss';
import {Navigate, Route, Routes} from "react-router-dom";
import {Profile} from "./Profile/Profile";
import {Users} from "./Users/Users";
import {Error} from "./Error/Error";

export const Main = () => {
    return (
        <div className={s.mainWrapper}>
            <Routes>
                <Route path={'/'} element={<Navigate to={'/profile'}/>}/>
                <Route path={'/profile'} element={<Profile/>}/>
                <Route path={'/profile/:id'} element={<Profile/>}/>
                <Route path={'/users'} element={<Users/>}/>
                <Route path={'/error'} element={<Error/>}/>
                <Route path={'/*'} element={<Navigate to={'/error'}/>}/>
            </Routes>
        </div>
    );
};