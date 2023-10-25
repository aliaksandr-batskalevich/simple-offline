import {RequestMethod} from "../models/RequestMethod";
import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {IUser} from "../../models/IUser";
import {setProfileData} from "../../bll/profile.reducer";
import {setUsers, updateUserFollowed} from "../../bll/users.reducer";
import {FollowRollback} from "../models/RollbackData/follow.rollback";

export class RollbackAction {

    static [RequestMethod.GET_USER](user: IUser | null, dispatch: ThunkDispatchType) {
        dispatch(setProfileData(user));
    }

    static [RequestMethod.GET_USERS](users: IUser[] | null, dispatch: ThunkDispatchType) {
        dispatch(setUsers(users));
    }

    static [RequestMethod.FOLLOW]({userId, isFollowed}: FollowRollback, dispatch: ThunkDispatchType) {
        dispatch(updateUserFollowed(userId, isFollowed));
    }

    static [RequestMethod.UNFOLLOW]({userId, isFollowed}: FollowRollback, dispatch: ThunkDispatchType) {
        dispatch(updateUserFollowed(userId, isFollowed));
    }

}