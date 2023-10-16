import React from 'react';
import s from './QueueRequestWindow.module.scss';
import {RequestElement} from "./RequestElement/RequestElement";
import {useAppDispatch} from "../../../../utils/hooks/useAppDispatch";
import {removeAllTabRequestsTC, removeRequestTC} from "../../../bll/requests.reducer";
import {AppRequest} from "../../../models/AppRequest";

interface QueueRequestWindowProps {
    requests: AppRequest[]
}

export const QueueRequestWindow: React.FC<QueueRequestWindowProps> = ({requests}) => {

    const dispatch = useAppDispatch();


    const removeRequestHandler = (requestId: string) => {
        dispatch(removeRequestTC(requestId));
    };

    const removeAllTabRequestsHandler = () => {
        dispatch(removeAllTabRequestsTC());
    };

    const requestsElementsToRender = requests.map(r => <RequestElement key={r.requestId} removeRequest={removeRequestHandler} {...r}/>);

    return (
        <div className={s.queueRequestWindow}>
            <div className={s.headWrapper}>
                <h3>REQUESTS</h3>
                <button onClick={removeAllTabRequestsHandler}>
                    Clear all
                </button>
            </div>
            {requestsElementsToRender}
        </div>
    );
};