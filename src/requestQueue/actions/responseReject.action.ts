import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {RequestMethod} from "../models/RequestMethod";
import {RollbackAction} from "./rollback.action";
import {addSnackbarErrorMessage} from "../../bll/snackbar.reducer";
import {IUser} from "../../models/IUser";
import {FollowRollback} from "../models/RollbackData/follow.rollback";


export class ResponseRejectAction {

    static _addErrorMessage(dispatch: ThunkDispatchType) {
        dispatch(addSnackbarErrorMessage('Request rejected, rollback activated!'));
    }

    static [RequestMethod.GET_USER](user: IUser | null, dispatch: ThunkDispatchType) {
        this._addErrorMessage(dispatch);
        RollbackAction[RequestMethod.GET_USER](user, dispatch);
    }

    static [RequestMethod.GET_USERS](users: IUser[] | null, dispatch: ThunkDispatchType) {
        this._addErrorMessage(dispatch);
        RollbackAction[RequestMethod.GET_USERS](users, dispatch);
    }

    static [RequestMethod.FOLLOW](followRollback: FollowRollback, dispatch: ThunkDispatchType) {
        this._addErrorMessage(dispatch);
        RollbackAction[RequestMethod.FOLLOW](followRollback, dispatch);
    }

    static [RequestMethod.UNFOLLOW](followRollback: FollowRollback, dispatch: ThunkDispatchType) {
        this._addErrorMessage(dispatch);
        RollbackAction[RequestMethod.FOLLOW](followRollback, dispatch);
    }

}