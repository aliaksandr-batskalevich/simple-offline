import React from 'react';
import s from './UserItem.module.scss';
import {IUserPart} from "../../../../models/IUser";
import defaultAvatar from '../../../../assets/images/default-avatar.png';
import {NavLink} from "react-router-dom";
import {SuperButton} from "../../../commons/SuperButton/SuperButton";

type UserItemPropsType = IUserPart & {
    profileInitId: number
    follow: (id: number) => void
    unFollow: (id: number) => void
};

export const UserItem: React.FC<UserItemPropsType> = ({
                                                  profileInitId,
                                                  id,
                                                  username,
                                                  rating,
                                                  isFollowed,
                                                  follow,
                                                  unFollow
                                              }) => {


    return (
        <div className={s.userWrapper}>
            <div className={s.avatarWrapper}>
                <img src={defaultAvatar} alt="userAvatar"/>
            </div>
            <div className={s.description}>
                <NavLink to={`/profile/${id}`}>
                    <h3>{username}</h3>
                </NavLink>
                <p>Rating: <span>{rating}</span></p>
                {profileInitId !== id
                && (!isFollowed
                    ? <SuperButton onClick={() => follow(id)}>follow</SuperButton>
                    : <SuperButton onClick={() => unFollow(id)}>unFollow</SuperButton>)}
            </div>
        </div>
    );
};