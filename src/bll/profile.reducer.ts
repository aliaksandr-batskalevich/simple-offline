import {IUser} from "../models/IUser";
import {ThunkDispatchType} from "../utils/hooks/useAppDispatch";
import {RootStateType} from "./store";
import {getProfileData} from "./profile.selectors";
import {AsyncAppDAL} from "../requestQueue/dal/asyncApp.dal";

export type ProfileActionsType = ReturnType<typeof setIsProfileInit>
    | ReturnType<typeof setProfileData>
    | ReturnType<typeof updateProfileFollowed>;

enum ProfileActions {
    SET_IS_PROFILE_INIT = "SET_IS_PROFILE_INIT",
    SET_PROFILE_DATA = "SET_PROFILE_DATA",
    UPDATE_IS_FOLLOWED = "UPDATE_IS_FOLLOWED",
}

export type ProfileStateType = {
    isProfileInit: boolean
    profileInitId: number
    profileData: IUser | null
};

const profileInitState: ProfileStateType = {
    isProfileInit: false,
    //hardcore
    profileInitId: 2,
    profileData: null,
};


export const profileReducer = (state: ProfileStateType = profileInitState, action: ProfileActionsType): ProfileStateType => {
    switch (action.type) {
        case ProfileActions.SET_IS_PROFILE_INIT:
        case ProfileActions.SET_PROFILE_DATA:
            return {...state, ...action.payload};
        case ProfileActions.UPDATE_IS_FOLLOWED:
            return {
                ...state,
                profileData: state.profileData
                    ? {...state.profileData, isFollowed: action.payload.isFollowed}
                    : null
            };
        default:
            return state;
    }
};

export const setIsProfileInit = (isProfileInit: boolean) => {
    return {
        type: ProfileActions.SET_IS_PROFILE_INIT,
        payload: {isProfileInit}
    } as const;
};
export const setProfileData = (profileData: null | IUser) => {
    return {
        type: ProfileActions.SET_PROFILE_DATA,
        payload: {profileData}
    } as const;
};
export const updateProfileFollowed = (isFollowed: boolean) => {
    return {
        type: ProfileActions.UPDATE_IS_FOLLOWED,
        payload: {isFollowed}
    } as const;
};

export const getProfileTC = (id: number) =>
    (dispatch: ThunkDispatchType, getState: () => RootStateType) =>
        AsyncAppDAL.getUser(dispatch, getState, id);