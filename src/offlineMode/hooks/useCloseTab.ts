import {useEffect} from "react";
import {StorageKeys} from "../dal/StorageTypes";
import {importRequestsFromStorageTC, replaceRequestsToNextTabTC} from "../bll/requests.reducer";
import {useAppDispatch} from "../../utils/hooks/useAppDispatch";

export const useCloseTab = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {

        const closeTabHandler = () => {
            dispatch(replaceRequestsToNextTabTC());
        };

        const updateStorageHandler = (event: StorageEvent) => {
            if (event.key !== StorageKeys.REQUESTS) return;

            dispatch(importRequestsFromStorageTC());
        };

        window.addEventListener("storage", updateStorageHandler);
        window.addEventListener('beforeunload', closeTabHandler);

        return () => {
            window.removeEventListener("storage", updateStorageHandler);
            window.removeEventListener('beforeunload', closeTabHandler);
        };
    }, [dispatch]);

};