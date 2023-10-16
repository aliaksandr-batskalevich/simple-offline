import React, {useEffect} from 'react';
import s from './Users.module.scss';
import {useSelector} from "react-redux";
import {
    getCountOnPage,
    getCurrentPage,
    getIsUsersFetching,
    getIsUsersPageInit,
    getTotalPage,
    getUsers
} from "../../../bll/users.selectors";
import {useAppDispatch} from "../../../utils/hooks/useAppDispatch";
import {followUserTC, getUsersTC, setCurrentPage, unFollowUserTC} from "../../../bll/users.reducer";
import {User} from "./User/User";
import {getProfileInitId} from "../../../bll/profile.selectors";

export const Users = () => {

    const profileInitId = useSelector(getProfileInitId);
    const isUsersPageInit = useSelector(getIsUsersPageInit);
    const isUsersFetching = useSelector(getIsUsersFetching);
    const countOnPage = useSelector(getCountOnPage);
    const currentPage = useSelector(getCurrentPage);
    const totalPage = useSelector(getTotalPage);
    const users = useSelector(getUsers);

    const dispatch = useAppDispatch();

    const setCurrentPageHandler = (currentPage: number) => {
        dispatch(setCurrentPage(currentPage));
    };
    const followHandler = (id: number) => {
        const pr = dispatch(followUserTC(id));
    };
    const unFollowHandler = (id: number) => {
        const pr = dispatch(unFollowUserTC(id));
    };

    useEffect(() => {
        const pr = dispatch(getUsersTC(countOnPage, currentPage));
    }, [countOnPage, currentPage]);

    const usersToRender = users
        ? users.map(user => <User
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