import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {setIsUsersFetching, setIsUsersPageInit, setTotalPage, setUsers, updateUser} from "../../bll/users.reducer";
import {FollowResponse} from "../../models/follow.response";
import {setIsProfileInit, setProfileData} from "../../bll/profile.reducer";
import {AllUsersResponse, UserResponse} from "../../models/users.response";
import {addSnackbarInfoMessage} from "../../bll/snackbar.reducer";
import {RequestMethod} from "../models/RequestMethod";

export class ResponseResolveAction {

    static [RequestMethod.GET_USER](response: UserResponse, dispatch: ThunkDispatchType) {
        dispatch(setProfileData(response.data.user));
        dispatch(setIsProfileInit(true));
        dispatch(addSnackbarInfoMessage(`Profile loaded!`));
    }

    static [RequestMethod.GET_USERS](response: AllUsersResponse, dispatch: ThunkDispatchType) {
        const totalPage = Math.ceil(response.data.totalCount / 4);

        dispatch(setUsers(response.data.users));
        dispatch(setTotalPage(totalPage));
        dispatch(setIsUsersFetching(false));
        dispatch(setIsUsersPageInit(true));
        dispatch(addSnackbarInfoMessage(`Users loaded!`));
    }

    static [RequestMethod.FOLLOW](response: FollowResponse, dispatch: ThunkDispatchType) {
        dispatch(updateUser(response.data.user));
    }

    static [RequestMethod.UNFOLLOW](response: FollowResponse, dispatch: ThunkDispatchType) {
        dispatch(updateUser(response.data.user));
    }

}