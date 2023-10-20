import React from 'react';
import s from './App.module.scss';
import {Snackbar} from "./components/Snackbar/Snackbar";
import {Header} from "./components/Header/Header";
import {Footer} from "./components/Footer/Footer";
import {Main} from "./components/Main/Main";
import {SideBar} from "./components/Main/SideBar/SideBar";
import {QueueRequestsMonitor} from "./requestQueue/components/QueueRequestsMonitor/QueueRequestsMonitor";
import {useCloseTab} from "./requestQueue/hooks/useCloseTab";

function App() {

    // requests between tabs control !!!
    useCloseTab();

    return (
        <div className={s.appWrapper}>
            <div className={s.container}>
                <Header/>
                <SideBar/>
                <Main/>
                <Footer/>
            </div>
            <Snackbar/>
            <QueueRequestsMonitor/>
        </div>
    );
}

export default App;
