import React, {useEffect} from 'react';
import s from './Message.module.scss';
import {SnackbarMessageTextType, SnackbarMessageType} from "../../../bll/snackbar.reducer";

type MessagePropsType = SnackbarMessageType & {
    closeMessage: (id: string) => void
};

export const Message: React.FC<MessagePropsType> = ({id, type, text, closeMessage}) => {

    let timingSec = {
        [SnackbarMessageTextType.ERROR]: 15,
        [SnackbarMessageTextType.WARNING]: 10,
        [SnackbarMessageTextType.INFO]: 5
    };

    useEffect(() => {
        let timeOutId = setTimeout(() => {
            closeMessageHandler();
        }, timingSec[type] * 1000)
        return () => {
            clearTimeout(timeOutId);
        }
    }, []);

    const closeMessageHandler = () => {
        closeMessage(id);
    };

    // let messageToRender = textCuter(text, 35);
    let messageToRender = text;

    let title = type.replace(/^[a-z]/, l => l.toUpperCase()) + ':';
    let classNameOfType = `${s.messageWrapper} ${s[type]}`;
    
    
    return (
        <div className={classNameOfType}>
            <div className={s.triangle}/>
            <div className={s.textWrapper}>
                <h3 className={s.title}>{title}</h3>
                <p>{messageToRender}</p>
                <div className={s.closeButton} onClick={closeMessageHandler}/>
            </div>
        </div>
    );
};