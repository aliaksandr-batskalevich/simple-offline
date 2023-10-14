import React, {useState} from 'react';
import s from './QueueRequestsMonitor.module.scss';
import {SuperButton} from "../../../components/commons/SuperButton/SuperButton";
import {QueueRequestWindow} from "./QueueRequestWindow/QueueRequestWindow";
import {useSelector} from "react-redux";
import {getRequests} from "../../bll/requests.selector";

export const QueueRequestsMonitor = () => {

    const requests = useSelector(getRequests);
    const [isOpen, setIsOpen] = useState<boolean>(false);


    return (
        <div className={s.queueRequestsMonitor__fullWrapper}>
            <div className={s.monitor__container}>
                {isOpen && <QueueRequestWindow requests={requests}/>}
                {/*{!isOpen && !!requests.length && <div>LABEL</div>}*/}
                <SuperButton onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '>>' : '<<'}
                </SuperButton>
            </div>
            {isOpen && <div className={s.closeWrapper} onClick={() => setIsOpen(false)}/>}
        </div>
    );
};
