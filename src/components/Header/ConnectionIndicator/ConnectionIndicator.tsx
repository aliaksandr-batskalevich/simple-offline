import React from 'react';
import s from './ConnectionIndicator.module.scss';
import {useControlConnection} from "../../../utils/hooks/useControlConnection";


export const ConnectionIndicator = () => {

    const isOnline = useControlConnection();

    return (
        <div className={s.connectionIndicator}>
            {isOnline
                ? <span>ONLINE</span>
                : <span className={s.offline}>OFFLINE</span>}
        </div>
    );
};