import React from 'react';
import s from './RequestElement.module.scss';
import {Request} from "../../../requestCreator";

interface RequestElementProps extends Request {

}

export const RequestElement: React.FC<RequestElementProps> = (props) => {

    const {title, dateCreate} = props;

    return (
        <div className={s.requestElement}>
            <h5>{title}</h5>
            <span>{dateCreate}</span>
        </div>
    );
};