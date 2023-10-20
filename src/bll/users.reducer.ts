import {IUser} from "../models/IUser";
import {ThunkDispatchType} from "../utils/hooks/useAppDispatch";
import {RootStateType} from "./store";
import {getFullUsers} from "./users.selectors";
import {AsyncAppDAL} from "../requestQueue/dal/asyncApp.dal";

export type UserActionsType = ReturnType<typeof setIsUsersPageInit>
    | ReturnType<typeof setIsUsersFetching>
    | ReturnType<typeof setUsers>
    | ReturnType<typeof updateUser>
    | ReturnType<typeof setCurrentPage>
    | ReturnType<typeof setTotalPage>
    | ReturnType<typeof updateUserFollowed>;

enum UsersActions {
    SET_IS_USERS_INIT = "SET_IS_USERS_INIT",
    SET_IS_USERS_FETCHING = "SET_IS_USERS_FETCHING",
    SET_USERS = "SET_USERS",
    UPDATE_USER = "UPDATE_USER",
    UPDATE_USER_FOLLOWED = "UPDATE_USER_FOLLOWED",
    SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
    SET_TOTAL_PAGE = "SET_TOTAL_PAGE",
}

type UsersStateType = {
    isUsersPageInit: boolean
    isUsersFetching: boolean

    users: Array<IUser> | null

    countOnPage: number
    currentPage: number
    totalPage: number | null
};

const userInitState: UsersStateType = {
    isUsersPageInit: false,
    isUsersFetching: false,

    users: null,

    countOnPage: 4,
    currentPage: 1,
    totalPage: null,
};

export const usersReducer = (state: UsersStateType = userInitState, action: UserActionsType): UsersStateType => {
    switch (action.type) {
        case UsersActions.SET_IS_USERS_INIT:
        case UsersActions.SET_IS_USERS_FETCHING:
        case UsersActions.SET_USERS:
        case UsersActions.SET_CURRENT_PAGE:
        case UsersActions.SET_TOTAL_PAGE:
            return {...state, ...action.payload};
        case UsersActions.UPDATE_USER:
            if (!state.users) return state;
            return {
                ...state, users: state.users?.map(u =>
                    u.id === action.payload.user.id
                        ? action.payload.user
                        : u)
            };
        case UsersActions.UPDATE_USER_FOLLOWED:
            return {
                ...state,
                users: state.users!
                    .map(user => user.id === action.payload.id
                        ? {...user, isFollowed: action.payload.isFollowed}
                        : user)
            };
        default:
            return state;
    }
};

export const setIsUsersPageInit = (isUsersPageInit: boolean) => {
    return {
        type: UsersActions.SET_IS_USERS_INIT,
        payload: {isUsersPageInit}
    } as const;
};
export const setIsUsersFetching = (isUsersFetching: boolean) => {
    return {
        type: UsersActions.SET_IS_USERS_FETCHING,
        payload: {isUsersFetching}
    } as const;
};
export const setUsers = (users: Array<IUser> | null) => {
    return {
        type: UsersActions.SET_USERS,
        payload: {users}
    } as const;
};
export const updateUser = (user: IUser) => {
    return {
        type: UsersActions.UPDATE_USER,
        payload: {user}
    } as const;
};
export const updateUserFollowed = (id: number, isFollowed: boolean) => {
    return {
        type: UsersActions.UPDATE_USER_FOLLOWED,
        payload: {id, isFollowed}
    } as const;
};
export const setTotalPage = (totalPage: number) => {
    return {
        type: UsersActions.SET_TOTAL_PAGE,
        payload: {totalPage}
    } as const;
};
export const setCurrentPage = (currentPage: number) => {
    return {
        type: UsersActions.SET_CURRENT_PAGE,
        payload: {currentPage}
    } as const;
};

export const getUsersTC = (count: number, page: number) =>
    (dispatch: ThunkDispatchType, getState: () => RootStateType) => {

            dispatch(setIsUsersFetching(true));

            // CREATE ROLLBACK
            const state = getState();
            const rollbackState: IUser[] | null = getFullUsers(state);

            AsyncAppDAL.getUsers(dispatch, rollbackState, count, page);
    };

export const followUserTC = (userId: number) =>
    (dispatch: ThunkDispatchType, getState: () => RootStateType) => {

            // CREATE ROLLBACK
            const state = getState();
            const users: IUser[] | null = getFullUsers(state);
            const rollbackData = users?.find(u => u.id === userId) || null;

            AsyncAppDAL.follow(dispatch, rollbackData, userId);
    };

export const unFollowUserTC = (userId: number) =>
    (dispatch: ThunkDispatchType, getState: () => RootStateType) => {

            // CREATE ROLLBACK
            const state = getState();
            const users: IUser[] | null = getFullUsers(state);
            const rollbackData = users?.find(u => u.id === userId) || null;

            AsyncAppDAL.unFollow(dispatch, rollbackData, userId);
    };