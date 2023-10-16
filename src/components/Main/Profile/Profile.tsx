import React, {useEffect} from 'react';
import s from './Profile.module.scss';
import {useSelector} from "react-redux";
import {getIsProfileInit, getProfileData, getProfileInitId} from "../../../bll/profile.selectors";
import {useAppDispatch} from "../../../utils/hooks/useAppDispatch";
import {Preloader} from "../../commons/Preloader/Preloader";
import {useParams} from "react-router-dom";
import {getProfileTC} from "../../../bll/profile.reducer";
import defaultAvatar from '../../../assets/images/default-avatar.png';
import {SuperButton} from "../../commons/SuperButton/SuperButton";

export const Profile = () => {

    const isProfileInit = useSelector(getIsProfileInit);
    const profileInitId = useSelector(getProfileInitId);
    const profileData = useSelector(getProfileData);
    const {id} = useParams<{ id: string }>();

    const dispatch = useAppDispatch();


    const followHandler = () => {
        // dispatch(updateProfileFollowed(true));
        // id && dispatch(followUserTC(+id))
        //     .catch((reason => {
        //         dispatch(addSnackbarErrorMessage(reason));
        //     }));
    };
    const unFollowHandler = () => {
        // dispatch(updateProfileFollowed(false));
        // id && dispatch(unFollowUserTC(+id))
        //     .catch((reason => {
        //         dispatch(addSnackbarErrorMessage(reason));
        //     }));
    };

    useEffect(() => {
        const fetchId = id ? +id : profileInitId;

        const pr = dispatch(getProfileTC(fetchId));

    }, [id]);

    return (
        isProfileInit && profileData
            ? <div className={s.profileWrapper}>
                <div className={s.avatarWrapper}>
                    <img src={defaultAvatar} alt="avatar"/>
                    {profileInitId !== profileData.id
                    && <div className={s.followButtonWrapper}>
                        {!profileData.isFollowed && <SuperButton onClick={followHandler}>follow</SuperButton>}
                        {profileData.isFollowed && <SuperButton onClick={unFollowHandler}>unFollow</SuperButton>}
                    </div>}
                </div>
                <div className={s.descriptionWrapper}>
                    <div className={s.profileInfoWrapper}>
                        <h3>Profile info:</h3>
                        <p>username: <span>{profileData.username}</span></p>
                        <p>subscribers: <span>{profileData.subscribersCount}</span></p>
                    </div>
                    <div className={s.profileStatisticsWrapper}>
                        <h3>Profile statistics:</h3>
                        <p>Rating: <span>{profileData.rating}</span></p>
                    </div>
                </div>
            </div>
            : <Preloader/>
    );
};