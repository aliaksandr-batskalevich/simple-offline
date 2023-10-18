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
import {RollbackAction} from "../actions/rollback.action";

export class RequestsQueueDAL {

    static _addRequestToQueue(request: AppRequest, dispatch: ThunkDispatchType) {
        const length = requestsStorage.addRequest(request);
        if (!length) return dispatch(addSnackbarErrorMessage('Offline mode blocked by primary request!'));

        dispatch(addRequest(request));

        // START ENGINE
        const pr = httpEngine.start(dispatch);
    }

    static getTabId() {
        return  tabsStorage.getTabId();
    }

    static removeRequestWithRollback(requestId: string, dispatch: ThunkDispatchType) {
        const request = requestsStorage.removeRequest(requestId);
        if (!request) return;

        // ROLLBACK APP DATA
        // get rollbackData and REMOVE it from storage
        const rollback = rollbackStorage.removeRollback(requestId);
        if (!rollback) return;

        // @ts-ignore
        RollbackAction[request.requestMethod](rollback.statePart, dispatch);

    }

    static removeAllTabRequestsWithRollback(dispatch: ThunkDispatchType) {
        const tabId = tabsStorage.getTabId();
        const allTabRequests = requestsStorage.removeAllTabRequest(tabId);

        // ROLLBACK APP DATA
        allTabRequests.forEach(r => {
            const rollback = rollbackStorage.removeRollback(r.requestId);
            if (!rollback) return;

            // @ts-ignore
            RollbackAction[r.requestMethod](rollback.statePart, dispatch);
        });
    }

    static replaceRequestsToNextTab() {
        const currentTabId = tabsStorage.getTabId();
        const targetTabId = tabsStorage.removeTabAndGetNext(currentTabId);
        if (!targetTabId) {
            requestsStorage.removeAllRequests();
            rollbackStorage.removeAllRollbacks();
            return;
        }

        requestsStorage.replaceRequests(currentTabId, targetTabId);
        rollbackStorage.replaceRollbacks(currentTabId, targetTabId);

        return {currentTabId, targetTabId};
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

        const request = new AppRequest(tabId, `GET user ${userId}`, requestConfig, RequestMethod.GET_USER, true);
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

        const request = new AppRequest(tabId, 'GET ALL USERS', requestConfig, RequestMethod.GET_USERS, true);
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

        const request = new AppRequest(tabId, `FOLLOW user ${userId}`, requestConfig, RequestMethod.FOLLOW);
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

        const request = new AppRequest(tabId, `UNFOLLOW user ${userId}`, requestConfig, RequestMethod.UNFOLLOW);
        const rollback = new Rollback(tabId, request.requestId, rollbackState);

        this._addRequestToQueue(request, dispatch);
        rollbackStorage.addRollback(rollback);
    }

}