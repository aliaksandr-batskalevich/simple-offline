import React, {useEffect} from 'react';
import s from './ConnectionIndicator.module.scss';
import {useSelector} from "react-redux";
import {getIsOnline} from "../../bll/app.selectors";
import {useAppDispatch} from "../../utils/hooks/useAppDispatch";
import {setIsOnline} from "../../bll/app.reducer";
import {engineAPI} from "../engineAPI";
import {addSnackbarInfoMessage, addSnackbarWarningMessage} from "../../bll/snackbar.reducer";
import {requestsStorage} from "../requestsStorage";


export const ConnectionIndicator = () => {

    const dispatch = useAppDispatch();
    const isOnline = useSelector(getIsOnline);

    useEffect(() => {

        const onlineHandler = () => {
            dispatch(setIsOnline(true));
            dispatch(addSnackbarInfoMessage('You are online now!'));
            engineAPI.engine(dispatch).then();
        };

        const offlineHandler = () => {
            dispatch(setIsOnline(false));
            dispatch(addSnackbarWarningMessage('Offline mode activated!'));
        };

        const closeTabHandler = () => {
            const tabId = requestsStorage.getTabId();
            const nextTabId = requestsStorage.removeTabAndGetNext(tabId);
            if (!nextTabId) return requestsStorage.removeAllRequests();

            requestsStorage.replaceRequests(tabId, nextTabId);
        }


        window.addEventListener('online', onlineHandler);
        window.addEventListener('offline', offlineHandler);
        window.addEventListener('beforeunload', closeTabHandler);

        return () => {
            window.removeEventListener('online', onlineHandler);
            window.removeEventListener('offline', offlineHandler);
            window.removeEventListener('beforeunload', closeTabHandler);
        };

    }, []);

    return (
        <div className={s.connectionIndicator}>
            {isOnline
                ? <span>ONLINE</span>
                : <span className={s.offline}>OFFLINE</span>}
        </div>
    );
};