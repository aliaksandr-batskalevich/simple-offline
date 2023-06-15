import React, {useEffect} from 'react';
import s from './Users.module.scss';
import {useSelector} from "react-redux";
import {
    getCountOnPage,
    getCurrentPage, getFollowingUsers,
    getIsUsersFetching,
    getIsUsersPageInit,
    getTotalPage, getUsers
} from "../../../bll/users.selectors";
import {useAppDispatch} from "../../../utils/hooks";
import {getUsersTC, setCurrentPage} from "../../../bll/users.reducer";
import {addSnackbarErrorMessage, addSnackbarInfoMessage} from "../../../bll/snackbar.reducer";
import SuperPaginator from "../../commons/Paginator/SuperPaginator";
import {Preloader} from "../../commons/Preloader/Preloader";
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
    const followingUsers = useSelector(getFollowingUsers);

    const dispatch = useAppDispatch();

    const setCurrentPageHandler = (currentPage: number) => {
        dispatch(setCurrentPage(currentPage));
    };
    const followHandler = (id: number) => {

    };
    const unFollowHandler = (id: number) => {

    };

    useEffect(() => {

        dispatch(getUsersTC(countOnPage, currentPage))
            .then(() => {
                dispatch(addSnackbarInfoMessage(`Users loaded!`));
            })
            .catch(reason => {
                dispatch(addSnackbarErrorMessage(reason));
            })

    }, [countOnPage, currentPage]);

    const usersToRender = users
        ? users.map(user => <User
                key={user.id}
                {...user}
                profileInitId={profileInitId}
                isFollowing={followingUsers.includes(user.id)}
                follow={followHandler}
                unFollow={unFollowHandler}
            />)
        : null;

    return (
        isUsersPageInit && totalPage
            ? <div className={s.usersWrapper}>
                <SuperPaginator
                    viewPagesOddNumber={9}
                    pageJumpPositive={5}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    setCurrentPage={setCurrentPageHandler}
                />
                {!isUsersFetching
                    ? usersToRender
                    : <Preloader/>}
            </div>
            : <Preloader/>
    );
};