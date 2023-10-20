import React, {useEffect} from 'react';
import s from './Users.module.scss';
import {useSelector} from "react-redux";
import {getCountOnPage, getCurrentPage, getUsers} from "../../bll/users.selectors";
import {useAppDispatch} from "../../utils/hooks/useAppDispatch";
import {followUserTC, getUsersTC, unFollowUserTC} from "../../bll/users.reducer";
import {UserItem} from "../../components/Main/users/UserItem/UserItem";
import {getProfileInitId} from "../../bll/profile.selectors";

export const Users = () => {

    const profileInitId = useSelector(getProfileInitId);
    // const isUsersPageInit = useSelector(getIsUsersPageInit);
    // const isUsersFetching = useSelector(getIsUsersFetching);
    // const totalPage = useSelector(getTotalPage);
    const countOnPage = useSelector(getCountOnPage);
    const currentPage = useSelector(getCurrentPage);
    const users = useSelector(getUsers);

    const dispatch = useAppDispatch();

    // const setCurrentPageHandler = (currentPage: number) => {
    //     dispatch(setCurrentPage(currentPage));
    // };

    const followHandler = (id: number) => {
        dispatch(followUserTC(id));
    };
    const unFollowHandler = (id: number) => {
        dispatch(unFollowUserTC(id));
    };

    useEffect(() => {
        dispatch(getUsersTC(countOnPage, currentPage));
    }, [countOnPage, currentPage, dispatch]);

    const usersToRender = users
        ? users.map(user => <UserItem
            key={user.id}
            {...user}
            profileInitId={profileInitId}
            follow={followHandler}
            unFollow={unFollowHandler}
        />)
        : null;

    return (
        // isUsersPageInit && totalPage
        //     ? <div className={s.usersWrapper}>
        //         <SuperPaginator
        //             viewPagesOddNumber={9}
        //             pageJumpPositive={5}
        //             currentPage={currentPage}
        //             totalPage={totalPage}
        //             setCurrentPage={setCurrentPageHandler}
        //         />
        //         {!isUsersFetching
        //             ? usersToRender
        //             : <Preloader/>}
        //     </div>
        //     : <Preloader/>

        <div className={s.usersWrapper}>
            {usersToRender}
        </div>
    );
};