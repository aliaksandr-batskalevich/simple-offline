import {useEffect} from "react";
import {setIsOnline} from "../../bll/app.reducer";
import {useSelector} from "react-redux";
import {getIsOnline} from "../../bll/app.selectors";
import {startHttpEngineTC} from "../../requestQueue/bll/requests.reducer";
import {addSnackbarInfoMessage, addSnackbarWarningMessage} from "../../bll/snackbar.reducer";
import {useAppDispatch} from "./useAppDispatch";

export const useControlConnection = (): boolean => {

    const isOnline = useSelector(getIsOnline);
    const dispatch = useAppDispatch();

    useEffect(() => {

        const onlineHandler = () => {
            dispatch(setIsOnline(true));
            dispatch(addSnackbarInfoMessage('You are online now!'));
            dispatch(startHttpEngineTC());
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

    return isOnline;
};