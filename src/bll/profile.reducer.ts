import {IUser} from "../models/IUser";
import {ThunkDispatchType} from "../utils/hooks";
import axios from 'axios';
import {UsersAPI} from "../dal/html.api";

export type ProfileActionsType = ReturnType<typeof setIsProfileInit>
    | ReturnType<typeof setProfileData>;

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
        case "PROFILE_SET_IS_PROFILE_INIT":
            return {...state, ...action.payload};
        case "PROFILE_SET_PROFILE_DATA":
            return {...state, ...action.payload};
        default:
            return state;
    }
};

const setIsProfileInit = (isProfileInit: boolean) => {
    return {
        type: 'PROFILE_SET_IS_PROFILE_INIT',
        payload: {isProfileInit}
    } as const;
};
const setProfileData = (profileData: null | IUser) => {
    return {
        type: 'PROFILE_SET_PROFILE_DATA',
        payload: {profileData}
    } as const;
};
export const getProfileTC = (id: number) => async (dispatch: ThunkDispatchType) => {
    try {
        dispatch(setIsProfileInit(false));

        const response = await UsersAPI.getUser(id);
        dispatch(setProfileData(response.data.user));
        dispatch(setIsProfileInit(true));
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