import React, {useEffect, useState} from 'react';
import s from './QueueRequestWindow.module.scss';
import {Request} from "../../requestCreator";
import {requestsStorage, StorageKeys} from "../../requestsStorage";
import {RequestElement} from "./RequestElement/RequestElement";

export const QueueRequestWindow = () => {

    const [queue, setQueue] = useState<Array<Request>>([]);

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
        }
    }, []);

    const requestElementsToRender = queue.map(r => <RequestElement key={r.requestId} {...r}/>)

    return (
        <div className={s.queueRequestWindow}>
            <h3>REQUESTS</h3>
            {requestElementsToRender}
        </div>
    );
};