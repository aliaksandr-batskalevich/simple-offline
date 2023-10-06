import React, {useEffect} from 'react';
import s from './ConnectionIndicator.module.scss';
import online from '../../../assets/images/online.png';
import offline from '../../../assets/images/offline.png';
import {useSelector} from "react-redux";
import {getIsOnline} from "../../../bll/app.selectors";
import {useAppDispatch} from "../../../utils/hooks";
import {setIsOnline} from "../../../bll/app.reducer";
import {letsGo} from "../../../dal/instance";


export const ConnectionIndicator = () => {

    const dispatch = useAppDispatch();
    const isOnline = useSelector(getIsOnline);

    const changeAppStatus = (isOnline: boolean) => {
        dispatch(setIsOnline(isOnline));

        console.log(window.navigator.onLine, isOnline);
        isOnline && letsGo();
    };

    useEffect(() => {
        window.addEventListener('online', () => changeAppStatus(true));
        window.addEventListener('offline', () => changeAppStatus(false));
    }, []);

    return (
        <div className={s.connectionIndicator}>
            {
                isOnline
                    ? <img src={online} alt="online"/>
                    : <img src={offline} alt="offline"/>
            }
        </div>
    );
};