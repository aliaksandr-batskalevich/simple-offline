import {RequestMethod} from "../models/RequestMethod";
import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {IUser} from "../../models/IUser";
import {setProfileData} from "../../bll/profile.reducer";
import {setUsers, updateUser} from "../../bll/users.reducer";

export class RollbackAction {

    static [RequestMethod.GET_USER](user: IUser | null, dispatch: ThunkDispatchType) {
        dispatch(setProfileData(user));
    }

    static [RequestMethod.GET_USERS](users: IUser[] | null, dispatch: ThunkDispatchType) {
        dispatch(setUsers(users));
    }

    static [RequestMethod.FOLLOW](user: IUser, dispatch: ThunkDispatchType) {
        dispatch(updateUser(user));
    }

    static [RequestMethod.UNFOLLOW](user: IUser, dispatch: ThunkDispatchType) {
        dispatch(updateUser(user));
    }

}