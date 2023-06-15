import {RootStateType} from "./store";
import {IUser} from "../models/IUser";

export const getIsProfileInit = (state: RootStateType): boolean => state.profile.isProfileInit;
export const getProfileInitId = (state: RootStateType): number => state.profile.profileInitId;
export const getProfileData = (state: RootStateType): null | IUser => state.profile.profileData;