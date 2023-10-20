import {AppRequest, HttpMethod, RequestConfig} from "../models/AppRequest";
import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {tabsStorage} from "./storageApi/tabsStorage.api";
import {RequestMethod} from "../models/RequestMethod";
import {Rollback} from "../models/Rollback";
import {rollbackStorage} from "./storageApi/rollbackStorage.api";
import {updateUserFollowed} from "../../bll/users.reducer";
import {requestsStorage} from "./storageApi/requestsStorage.api";
import {addSnackbarErrorMessage} from "../../bll/snackbar.reducer";
import {addRequest} from "../bll/requests.reducer";
import {httpEngine} from "../engine/httpEngine";

export class AsyncAppDAL {

    static _addRequestToQueue(request: AppRequest, rollback: Rollback, dispatch: ThunkDispatchType) {
        const length = requestsStorage.addRequest(request);
        if (!length) return dispatch(addSnackbarErrorMessage('Offline mode blocked by primary request!'));

        dispatch(addRequest(request));

        // ADD ROLLBACK TO STORAGE
        rollbackStorage.addRollback(rollback);

        // START ENGINE
        httpEngine.start(dispatch).then();
    }

    // ASYNC METHODS
    static getUser(dispatch: ThunkDispatchType, rollbackState: any, userId: number) {
        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.GET,
            'users',
            true,
            userId
        );

        const request = new AppRequest(tabId, `GET user ${userId}`, requestConfig, RequestMethod.GET_USER, true);
        const rollback = new Rollback(tabId, request.requestId, rollbackState);

        this._addRequestToQueue(request, rollback, dispatch);
    }

    static getUsers(dispatch: ThunkDispatchType, rollbackState: any, count: number, page: number) {
        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.GET,
            'users',
            true,
            undefined,
            {count, page},
        );

        const request = new AppRequest(tabId, 'GET ALL USERS', requestConfig, RequestMethod.GET_USERS, true);
        const rollback = new Rollback(tabId, request.requestId, rollbackState);

        this._addRequestToQueue(request, rollback, dispatch);
    }

    static follow(dispatch: ThunkDispatchType, rollbackState: any, userId: number) {
        dispatch(updateUserFollowed(userId, true));

        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.POST,
            'follow',
            true,
            userId
        );

        const request = new AppRequest(tabId, `FOLLOW user ${userId}`, requestConfig, RequestMethod.FOLLOW);
        const rollback = new Rollback(tabId, request.requestId, rollbackState);

        this._addRequestToQueue(request, rollback, dispatch);
    }

    static unFollow(dispatch: ThunkDispatchType, rollbackState: any, userId: number) {

        dispatch(updateUserFollowed(userId, false));

        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.DELETE,
            'follow',
            true,
            userId
        );

        const request = new AppRequest(tabId, `UNFOLLOW user ${userId}`, requestConfig, RequestMethod.UNFOLLOW);
        const rollback = new Rollback(tabId, request.requestId, rollbackState);

        this._addRequestToQueue(request, rollback, dispatch);
    }

}