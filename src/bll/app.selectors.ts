import {RootStateType} from "./store";

export const getIsOnline = (state: RootStateType): boolean => state.app.isOnline;