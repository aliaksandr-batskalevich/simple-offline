import React, {useEffect} from 'react';
import s from './ConnectionIndicator.module.scss';
import {useSelector} from "react-redux";
import {getIsOnline} from "../../bll/app.selectors";
import {useAppDispatch} from "../../utils/hooks/useAppDispatch";
import {setIsOnline} from "../../bll/app.reducer";
import {engineAPI} from "../engineAPI";
import {addSnackbarInfoMessage, addSnackbarWarningMessage} from "../../bll/snackbar.reducer";


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


        window.addEventListener('online', onlineHandler);
        window.addEventListener('offline', offlineHandler);

        return () => {
            window.removeEventListener('online', onlineHandler);
            window.removeEventListener('offline', offlineHandler);
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