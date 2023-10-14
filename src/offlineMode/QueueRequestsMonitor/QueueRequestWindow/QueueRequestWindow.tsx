import React, {useEffect, useState} from 'react';
import s from './QueueRequestWindow.module.scss';
import {Request} from "../../requestCreator";
import {requestsStorage, StorageKeys} from "../../requestsStorage";
import {RequestElement} from "./RequestElement/RequestElement";

export const QueueRequestWindow = () => {

    let [queue, setQueue] = useState<Array<Request>>([]);

    useEffect(() => {

        const setQueueHandler = () => {
            const newQueue = requestsStorage.getAllTabRequests();
            setQueue(newQueue);
        };

        const updateStorageHandler = (event: StorageEvent) => {
            if (event.key !== StorageKeys.REQUESTS) return;

            setQueueHandler();
        };

        setQueueHandler();

        window.addEventListener("storage", updateStorageHandler);

        return () => {
            window.removeEventListener("storage", updateStorageHandler);
        };
    }, []);

    const removeRequestHandler = (requestId: string) => {
        requestsStorage.removeRequest(requestId);
        queue = queue.filter(r => r.requestId !== requestId);
        setQueue(queue);
    };

    const removeAllTabRequestsHandler = () => {
        requestsStorage.removeAllTabRequest();
        const tabId = requestsStorage.getTabId();
        queue = queue.filter(r => r.tabId !== tabId);
        setQueue(queue);
    };

    const requestElementsToRender = queue.map(r => <RequestElement key={r.requestId} removeRequest={removeRequestHandler} {...r}/>);

    return (
        <div className={s.queueRequestWindow}>
            <div className={s.headWrapper}>
                <h3>REQUESTS</h3>
                <button onClick={removeAllTabRequestsHandler}>
                    Clear all
                </button>
            </div>

            {requestElementsToRender}
        </div>
    );
};