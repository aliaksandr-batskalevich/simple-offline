import {ThunkDispatchType} from "../utils/hooks/useAppDispatch";
import {setIsUsersFetching, setIsUsersPageInit, setTotalPage, setUsers, updateUser} from "../bll/users.reducer";
import {FollowResponse} from "../models/follow.response";
import {AxiosResponse} from 'axios';
import {setIsProfileInit, setProfileData} from "../bll/profile.reducer";
import {AllUsersResponse, UserResponse} from "../models/users.response";
import {addSnackbarInfoMessage} from "../bll/snackbar.reducer";

export enum ResponseMethod {
    SET_USER = 'setUser',
    SET_USERS = 'setUsers',

    FOLLOW = 'follow',
    UNFOLLOW = 'unfollow',
}

export class ResponseActions {

    static [ResponseMethod.SET_USER](response: UserResponse, dispatch: ThunkDispatchType) {
        dispatch(setProfileData(response.data.user));
        dispatch(setIsProfileInit(true));
        dispatch(addSnackbarInfoMessage(`Profile loaded!`));
    }

    static [ResponseMethod.SET_USERS](response: AllUsersResponse, dispatch: ThunkDispatchType) {
        const totalPage = Math.ceil(response.data.totalCount / 4);

        dispatch(setUsers(response.data.users));
        dispatch(setTotalPage(totalPage));
        dispatch(setIsUsersFetching(false));
        dispatch(setIsUsersPageInit(true));
        dispatch(addSnackbarInfoMessage(`Users loaded!`));
    }

    static [ResponseMethod.FOLLOW](response: FollowResponse, dispatch: ThunkDispatchType) {
        dispatch(updateUser(response.data.user));
    }

}