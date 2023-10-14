import {useEffect} from "react";
import {setIsOnline} from "../../bll/app.reducer";
import {addSnackbarInfoMessage, addSnackbarWarningMessage} from "../../bll/snackbar.reducer";
import {startHttpEngineTC} from "../bll/requests.reducer";
import {useAppDispatch} from "../../utils/hooks/useAppDispatch";
import {useSelector} from "react-redux";
import {getIsOnline} from "../../bll/app.selectors";

export const useConnectionIndicator = () => {

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