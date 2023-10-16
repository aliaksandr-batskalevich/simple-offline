import {RootStateType} from "../../bll/store";

export const getIsOnline = (state: RootStateType): boolean => state.app.isOnline;