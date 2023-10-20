import React from 'react';
import {Navigate, Routes, Route} from "react-router-dom";
import {Profile} from "../pages/Profile/Profile";
import {Users} from "../pages/Users/Users";
import {Error} from "../pages/Error/Error";

export const AppRoutes = () => {

    return (
        <Routes>
            <Route path={'/'} element={<Navigate to={'/profile'}/>}/>
            <Route path={'/profile'} element={<Profile/>}/>
            <Route path={'/profile/:id'} element={<Profile/>}/>
            <Route path={'/users'} element={<Users/>}/>
            <Route path={'/error'} element={<Error/>}/>
            <Route path={'/*'} element={<Navigate to={'/error'}/>}/>
        </Routes>
    );
};