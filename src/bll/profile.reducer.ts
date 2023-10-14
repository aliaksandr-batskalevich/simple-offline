import {IUser} from "../models/IUser";
import {ThunkDispatchType} from "../utils/hooks/useAppDispatch";
import {RequestsQueueDAL} from "../offlineMode/dal/requestsQueue.dal";

export type ProfileActionsType = ReturnType<typeof setIsProfileInit>
    | ReturnType<typeof setProfileData>
    | ReturnType<typeof updateProfileFollowed>;

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
        case "PROFILE_SET_PROFILE_DATA":
            return {...state, ...action.payload};
        case "PROFILE_UPDATE_IS_FOLLOWED":
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
        type: 'PROFILE_SET_IS_PROFILE_INIT',
        payload: {isProfileInit}
    } as const;
};
export const setProfileData = (profileData: null | IUser) => {
    return {
        type: 'PROFILE_SET_PROFILE_DATA',
        payload: {profileData}
    } as const;
};
export const updateProfileFollowed = (isFollowed: boolean) => {
    return {
        type: 'PROFILE_UPDATE_IS_FOLLOWED',
        payload: {isFollowed}
    } as const;
};

export const getProfileTC = (id: number) => async (dispatch: ThunkDispatchType) => {
    try {
        dispatch(setProfileData(null));
        dispatch(setIsProfileInit(false));

        // ADD REQUEST TO QUEUE
        const pr = RequestsQueueDAL.getUser(id, dispatch);

    } catch (error) {
        console.log(error);
    }
};