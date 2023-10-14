import React from 'react';
import s from './RequestElement.module.scss';
import {AppRequest} from "../../../../IAppRequest";

interface RequestElementProps extends AppRequest {
    removeRequest: (requestId: string) => void
}

export const RequestElement: React.FC<RequestElementProps> = (props) => {

    const {requestId, title, dateCreate, removeRequest} = props;

    const removeRequestHandler = () => {
        removeRequest(requestId);
    };

    return (
        <div className={s.requestElement}>
            <div className={s.titleWrapper}>
                <h5>{title}</h5>
                <button onClick={removeRequestHandler}/>
            </div>
            <span>{dateCreate}</span>
        </div>
    );
};