import {RootStateType} from "./store";
import {IUser, IUserPart} from "../models/IUser";
import {createSelector} from 'reselect';


export const getIsUsersPageInit = (state: RootStateType): boolean => state.users.isUsersPageInit;
export const getIsUsersFetching = (state: RootStateType): boolean => state.users.isUsersFetching;
export const getFullUsers = (state: RootStateType): Array<IUser> | null => state.users.users;
export const getCountOnPage = (state: RootStateType): number => state.users.countOnPage;
export const getCurrentPage = (state: RootStateType): number => state.users.currentPage;
export const getTotalPage = (state: RootStateType): number | null => state.users.totalPage;

// SELECTORS BY RESELECT

export const getUsers = createSelector(getFullUsers, (fullUsers: Array<IUser> | null): Array<IUserPart> | null => {
    if (!fullUsers) return null;
    return fullUsers.map(fullUser => ({
            id: fullUser.id,
            username: fullUser.username,
            rating: fullUser.rating,
            isFollowed: fullUser.isFollowed,
        } as IUserPart));
});

