import React, {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';
import s from './SuperButton.module.scss';

type DefaultButtonPropsType = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
type SuperButtonPropsType = DefaultButtonPropsType & {
    isLoading?: boolean
};

export const SuperButton: React.FC<SuperButtonPropsType> = (props) => {

    const {isLoading, disabled, className, ...restProps} = props;
    const newDisabled = disabled || isLoading;
    const newClassName = isLoading
        ? `${className} ${s.custom} ${s.loading}`
        : `${className} ${s.custom}`;

    return (
            <button
                {...restProps}
                disabled={newDisabled}
                className={newClassName}
            >
                {props.children}
            </button>
    );
};