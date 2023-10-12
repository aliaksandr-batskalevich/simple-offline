import React from 'react';
import s from './App.module.scss';
import {Snackbar} from "./components/Snackbar/Snackbar";
import {Header} from "./components/Header/Header";
import {Footer} from "./components/Footer/Footer";
import {Main} from "./components/Main/Main";
import {SideBar} from "./components/Main/SideBar/SideBar";

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
