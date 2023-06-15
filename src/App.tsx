import React from 'react';
import s from './App.module.scss';
import {Header} from "./components/Header/Header";
import {Main} from "./components/Main/Main";
import {Footer} from "./components/Footer/Footer";
import {SideBar} from "./components/Main/SideBar/SideBar";
import {Snackbar} from "./components/Snackbar/Snackbar";

function App() {
    return (
        <div className={s.appWrapper}>
            <div className={s.container}>
                <Header/>
                <SideBar/>
                <Main/>
                <Footer/>
            </div>
            <Snackbar/>
        </div>
    );
}

export default App;
