import React from 'react';
import s from './PaginatorButton.module.css';

export enum PaginatorButtonType {
    TO_FIRST = 'toFirst',
    TO_LAST = 'toLast',
    JUMP_DOWN_BY_ONE = 'jumpDownByOne',
    JUMP_UP_BY_ONE = 'jumpUpByOne',
    JUMP_DOWN_BIG = 'jumpDownBig',
    JUMP_UP_BIG = 'jumpUpBig'
}
type PaginatorButtonPropsType = {
    buttonType: PaginatorButtonType
    onClick: () => void
}

export const PaginatorButton: React.FC<PaginatorButtonPropsType> = ({buttonType, onClick}) => {

    const elementMaker = (buttonType: PaginatorButtonType) => {
        switch (buttonType) {
            case PaginatorButtonType.JUMP_UP_BY_ONE: return '>';
            case PaginatorButtonType.JUMP_DOWN_BY_ONE: return '<';
            case PaginatorButtonType.JUMP_UP_BIG: return '>>';
            case PaginatorButtonType.JUMP_DOWN_BIG: return '<<';
            case PaginatorButtonType.TO_FIRST: return '❘<';
            case PaginatorButtonType.TO_LAST: return '>❘';
            // default: return 'Error';
        }
    };

    let element = elementMaker(buttonType);

    return (
        <div className={s.commonClass} onClick={onClick}>
            {element}
        </div>
    );
};