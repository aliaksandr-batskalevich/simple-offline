import React, {useState} from 'react';
import s from './QueueRequestWindow.module.scss';
import {RequestElement} from "./RequestElement/RequestElement";
import {useAppDispatch} from "../../../../utils/hooks/useAppDispatch";
import {removeAllTabRequestsTC, removeRequestTC} from "../../../bll/requests.reducer";
import {AppRequest} from "../../../models/AppRequest";
import {RequestsQueueDAL} from "../../../dal/requestsQueue.dal";

interface QueueRequestWindowProps {
    requests: AppRequest[]
}

export const QueueRequestWindow: React.FC<QueueRequestWindowProps> = ({requests}) => {

    const [tabId] = useState<string>(RequestsQueueDAL.getTabId());

    const dispatch = useAppDispatch();

    const removeRequestHandler = (requestId: string) => {
        dispatch(removeRequestTC(requestId));
    };

    const removeAllTabRequestsHandler = () => {
        dispatch(removeAllTabRequestsTC());
    };

    const requestsElementsToRender = requests
        .filter(r => r.tabId === tabId)
        .map(r => <RequestElement key={r.requestId} removeRequest={removeRequestHandler} {...r}/>);

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