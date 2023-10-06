import {IUser} from "../models/IUser";
import {ThunkDispatchType} from "../utils/hooks";
import {FollowAPI, UsersAPI} from "../dal/html.api";
import axios from "axios";

export type UserActionsType = ReturnType<typeof setIsUsersPageInit>
    | ReturnType<typeof setIsUsersFetching>
    | ReturnType<typeof setUsers>
    | ReturnType<typeof setCurrentPage>
    | ReturnType<typeof setTotalPage>
    | ReturnType<typeof updateUserFollowed>
    | ReturnType<typeof addFollowingUser>
    | ReturnType<typeof removeFollowingUser>;

type UsersStateType = {
    isUsersPageInit: boolean
    isUsersFetching: boolean

    users: Array<IUser> | null

    countOnPage: number
    currentPage: number
    totalPage: number | null

    followingUsers: Array<number>
};

const userInitState: UsersStateType = {
    isUsersPageInit: false,
    isUsersFetching: false,

    users: null,

    countOnPage: 4,
    currentPage: 1,
    totalPage: null,

    followingUsers: [],
};

export const usersReducer = (state: UsersStateType = userInitState, action: UserActionsType): UsersStateType => {
    switch (action.type) {
        case "USERS_SET_IS_USERS_INIT":
        case "USERS_SET_IS_USERS_FETCHING":
        case "USERS_SET_USERS":
        case "USERS_SET_CURRENT_PAGE":
        case "USERS_SET_TOTAL_PAGE":
            return {...state, ...action.payload};
        case "USERS_UPDATE_USER_FOLLOWED":
            return {
                ...state,
                users: state.users!
                    .map(user => user.id === action.payload.id
                        ? {...user, isFollowed: action.payload.isFollowed}
                        : user)
            };
        case "USERS_ADD_FOLLOWING_USER":
            return {...state, followingUsers: [...state.followingUsers, action.payload.id]};
        case "USERS_REMOVE_FOLLOWING_USER":
            return {...state, followingUsers: state.followingUsers.filter(id => id !== action.payload.id)};
        default:
            return state;
    }
};

const setIsUsersPageInit = (isUsersPageInit: boolean) => {
    return {
        type: 'USERS_SET_IS_USERS_INIT',
        payload: {isUsersPageInit}
    } as const;
};
const setIsUsersFetching = (isUsersFetching: boolean) => {
    return {
        type: 'USERS_SET_IS_USERS_FETCHING',
        payload: {isUsersFetching}
    } as const;
};
const setUsers = (users: Array<IUser>) => {
    return {
        type: 'USERS_SET_USERS',
        payload: {users}
    } as const;
};
const setTotalPage = (totalPage: number) => {
    return {
        type: 'USERS_SET_TOTAL_PAGE',
        payload: {totalPage}
    } as const;
};
export const setCurrentPage = (currentPage: number) => {
    return {
        type: 'USERS_SET_CURRENT_PAGE',
        payload: {currentPage}
    } as const;
};

export const updateUserFollowed = (id: number, isFollowed: boolean) => {
    return {
        type: 'USERS_UPDATE_USER_FOLLOWED',
        payload: {id, isFollowed}
    } as const;
};
const addFollowingUser = (id: number) => {
    return {
        type: 'USERS_ADD_FOLLOWING_USER',
        payload: {id}
    } as const;
};
const removeFollowingUser = (id: number) => {
    return {
        type: 'USERS_REMOVE_FOLLOWING_USER',
        payload: {id}
    } as const;
};

export const getUsersTC = (count: number, page: number) => async (dispatch: ThunkDispatchType) => {
    try {
        dispatch(setIsUsersFetching(true));

        const response = await UsersAPI.getUsers(count, page);
        const totalPage = Math.ceil(response.data.totalCount / count);

        dispatch(setUsers(response.data.users));
        dispatch(setTotalPage(totalPage));
        dispatch(setIsUsersFetching(false));
        dispatch(setIsUsersPageInit(true));
    } catch (error) {
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
            errorMessage = error.response
                ? error.response.data.message
                : error.message;

        } else {
            //@ts-ignore
            errorMessage = error.message;
        }
        console.log(errorMessage);
        return Promise.reject(errorMessage);
    }
};

export const followUserTC = (id: number) => async (dispatch: ThunkDispatchType) => {
    try {

        const response = await FollowAPI.followCustom(id);

    } catch (error) {
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
            errorMessage = error.response
                ? error.response.data.message
                : error.message;
        } else {
            //@ts-ignore
            errorMessage = error.message;
        }
        console.log(errorMessage);

        return Promise.reject(errorMessage);
    }
};

export const unFollowUserTC = (id: number) => async (dispatch: ThunkDispatchType) => {
    try {
        // dispatch(addFollowingUser(id));

        const response = await FollowAPI.unFollow(id);

        // dispatch(removeFollowingUser(id));

    } catch (error) {
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
            errorMessage = error.response
                ? error.response.data.message
                : error.message;
        } else {
            //@ts-ignore
            errorMessage = error.message;
        }
        console.log(errorMessage);

        // dispatch(removeUserIdFollowing(id));

        return Promise.reject(errorMessage);
    }
};