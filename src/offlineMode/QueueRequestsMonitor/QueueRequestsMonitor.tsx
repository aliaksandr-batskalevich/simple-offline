import React, {useState} from 'react';
import s from './QueueRequestsMonitor.module.scss';
import {SuperButton} from "../../components/commons/SuperButton/SuperButton";
import {QueueRequestWindow} from "./QueueRequestWindow/QueueRequestWindow";

export const QueueRequestsMonitor = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);


    return (
        <div className={s.queueRequestsMonitor__fullWrapper}>
            <div className={s.monitor__container}>
                {isOpen && <QueueRequestWindow/>}
                <SuperButton onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '>>' : '<<'}
                </SuperButton>
            </div>
            {isOpen && <div className={s.closeWrapper} onClick={() => setIsOpen(false)}/>}
        </div>
    );
};
