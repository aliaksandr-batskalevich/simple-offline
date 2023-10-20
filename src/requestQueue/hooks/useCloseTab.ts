import {useEffect} from "react";
import {replaceRequestsToNextTabTC} from "../bll/requests.reducer";
import {useAppDispatch} from "../../utils/hooks/useAppDispatch";

export const useCloseTab = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {

        const closeTabHandler = () => {
            dispatch(replaceRequestsToNextTabTC());
        };

        window.addEventListener('beforeunload', closeTabHandler);

        return () => {
            window.removeEventListener('beforeunload', closeTabHandler);
        };
    }, [dispatch]);

};