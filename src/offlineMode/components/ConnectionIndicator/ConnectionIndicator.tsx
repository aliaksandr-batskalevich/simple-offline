import React from 'react';
import s from './ConnectionIndicator.module.scss';
import {useConnectionIndicator} from "../../hooks/useConnectionIndicator";


export const ConnectionIndicator = () => {

    const isOnline = useConnectionIndicator();

    return (
        <div className={s.connectionIndicator}>
            {isOnline
                ? <span>ONLINE</span>
                : <span className={s.offline}>OFFLINE</span>}
        </div>
    );
};