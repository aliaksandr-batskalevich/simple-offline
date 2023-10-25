import {setIsProfileInit, setProfileData} from "../../bll/profile.reducer";
import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {RequestMethod} from "../models/RequestMethod";
import {setIsUsersFetching, updateUserFollowed} from "../../bll/users.reducer";

export class BllAction {
    static [RequestMethod.GET_USER](dispatch: ThunkDispatchType) {
        dispatch(setProfileData(null));
        dispatch(setIsProfileInit(false));
    }

    static [RequestMethod.GET_USERS](dispatch: ThunkDispatchType) {
        dispatch(setIsUsersFetching(true));
    }

    static [RequestMethod.FOLLOW](dispatch: ThunkDispatchType, userId: number) {
        dispatch(updateUserFollowed(userId, true));
    }

    static [RequestMethod.UNFOLLOW](dispatch: ThunkDispatchType, userId: number) {
        dispatch(updateUserFollowed(userId, false));
    }
}