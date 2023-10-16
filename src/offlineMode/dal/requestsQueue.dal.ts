import {HttpMethod, RequestConfig} from "../models/AppRequest";
import {httpEngine} from "../httpEngine";
import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {AppRequest} from '../models/AppRequest';
import {addSnackbarErrorMessage} from "../../bll/snackbar.reducer";
import {requestsStorage} from "./storageApi/requestsStorage.api";
import {tabsStorage} from "./storageApi/tabsStorage.api";
import {addRequest} from "../bll/requests.reducer";
import {RequestMethod} from "../models/RequestMethod";
import {Rollback} from "../models/Rollback";
import {rollbackStorage} from "./storageApi/rollbackStorage.api";
import {updateUserFollowed} from "../../bll/users.reducer";

export class RequestsQueueDAL {

    static _addRequestToQueue(request: AppRequest, dispatch: ThunkDispatchType) {
        const length = requestsStorage.addRequest(request);
        if (!length) return dispatch(addSnackbarErrorMessage('Offline mode blocked by primary request!'));

        dispatch(addRequest(request));

        // START ENGINE
        const pr = httpEngine.start(dispatch);
    }

    static getAllTabRequests() {
        const tabId = tabsStorage.getTabId();
        return requestsStorage.getAllTabRequests(tabId);
    }

    static removeRequest(requestId: string) {
        requestsStorage.removeRequest(requestId);
        rollbackStorage.removeRollback(requestId);
    }

    static removeAllTabRequests() {
        const tabId = tabsStorage.getTabId();
        requestsStorage.removeAllTabRequest(tabId);
        rollbackStorage.removeAllTabRollbacks(tabId);
    }

    static replaceRequestsToNextTab() {
        const tabId = tabsStorage.getTabId();
        const nextTabId = tabsStorage.removeTabAndGetNext(tabId);
        if (!nextTabId) {
            requestsStorage.removeAllRequests();
            rollbackStorage.removeAllRollbacks();
            return;
        }

        requestsStorage.replaceRequests(tabId, nextTabId);
        rollbackStorage.replaceRollbacks(tabId, nextTabId);
    }

    // ASYNC METHODS
    static async getUser(userId: number, dispatch: ThunkDispatchType, rollbackState: any) {
        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.GET,
            'users',
            true,
            userId
        );
        const responseMethod = RequestMethod.GET_USER;

        const request = new AppRequest(tabId, `GET user ${userId}`, requestConfig, responseMethod, true);
        const rollback = new Rollback(tabId, request.requestId, rollbackState);

        this._addRequestToQueue(request, dispatch);
        rollbackStorage.addRollback(rollback);
    }

    static async getUsers(count: number, page: number, dispatch: ThunkDispatchType, rollbackState: any) {
        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.GET,
            'users',
            true,
            undefined,
            {count, page},
        );
        const responseMethod = RequestMethod.GET_USERS;

        const request = new AppRequest(tabId, 'GET ALL USERS', requestConfig, responseMethod, true);
        const rollback = new Rollback(tabId, request.requestId, rollbackState);

        this._addRequestToQueue(request, dispatch);
        rollbackStorage.addRollback(rollback);
    }

    static async follow(userId: number, dispatch: ThunkDispatchType, rollbackState: any) {
        dispatch(updateUserFollowed(userId, true));

        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.POST,
            'follow',
            true,
            userId
        );
        const responseMethod = RequestMethod.FOLLOW;

        const request = new AppRequest(tabId, `FOLLOW user ${userId}`, requestConfig, responseMethod);
        const rollback = new Rollback(tabId, request.requestId, rollbackState);

        this._addRequestToQueue(request, dispatch);
        rollbackStorage.addRollback(rollback);
    }

    static async unFollow(userId: number, dispatch: ThunkDispatchType, rollbackState: any) {

        dispatch(updateUserFollowed(userId, false));

        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.DELETE,
            'follow',
            true,
            userId
        );
        const responseMethod = RequestMethod.UNFOLLOW;

        const request = new AppRequest(tabId, `UNFOLLOW user ${userId}`, requestConfig, responseMethod);
        const rollback = new Rollback(tabId, request.requestId, rollbackState);

        this._addRequestToQueue(request, dispatch);
        rollbackStorage.addRollback(rollback);
    }

}