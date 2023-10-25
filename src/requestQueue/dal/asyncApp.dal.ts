import {AppRequest, HttpMethod, RequestConfig} from "../models/AppRequest";
import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {tabsStorage} from "./storageApi/tabsStorage.api";
import {RequestMethod} from "../models/RequestMethod";
import {Rollback} from "../models/Rollback";
import {requestsStorage} from "./storageApi/requestsStorage.api";
import {addRequest, removeRequest} from "../bll/requests.reducer";
import {httpEngine} from "../engine/httpEngine";
import {getProfileData} from "../../bll/profile.selectors";
import {RootStateType} from "../../bll/store";
import {BllAction} from "../actions/bll.action";
import {getFullUsers} from "../../bll/users.selectors";
import {FollowRollback} from "../models/RollbackData/follow.rollback";
import {ProfileRollback} from "../models/RollbackData/profile.rollback";
import {UsersRollback} from "../models/RollbackData/users.rollback";
import {addSnackbarErrorMessage} from "../../bll/snackbar.reducer";

const optimizationPairs = {
    [RequestMethod.GET_USER]: [],
    [RequestMethod.GET_USERS]: [],
    [RequestMethod.FOLLOW]: [],
    [RequestMethod.UNFOLLOW]: [],
};

const destroyPairs = {
    [RequestMethod.GET_USER]: [],
    [RequestMethod.GET_USERS]: [],
    [RequestMethod.FOLLOW]: [RequestMethod.UNFOLLOW],
    [RequestMethod.UNFOLLOW]: [RequestMethod.FOLLOW],
}

export class AsyncAppDAL {

    // PRIVATE METHODS
    static _requestTitleCreator(effect: string, operand: string, id?: string | number) {
        const _getFirstWord = (phrase: string) => phrase.split(' ', 1)[0];

        const phraseArr = [
            _getFirstWord(effect).toUpperCase(),
            _getFirstWord(operand).toLowerCase(),
        ] as Array<string | number>;

        id !== undefined && phraseArr.push(id);

        return phraseArr.join(' ');
    }

    static _getIdFromRequestTitle(title: string) {
        return title.split(' ')[2];
    }

    static _queryOptimizer(dispatch: ThunkDispatchType, request: AppRequest) {

        let requestQueue = requestsStorage.getAllRequests();
        // check primary requests
        if (requestQueue.find(r => r.tabId === request.tabId && r.isPrimary)) {
            return dispatch(addSnackbarErrorMessage('Offline mode blocked by primary request!'));
        }

        const optimizationPair = optimizationPairs[request.requestMethod] as RequestMethod[];
        const destroyPair = destroyPairs[request.requestMethod] as RequestMethod[];

        const optimizationRequest = requestQueue.find(r =>
            !r.inProgress
            && optimizationPair.includes(r.requestMethod)
            && this._getIdFromRequestTitle(request.title) === this._getIdFromRequestTitle(r.title)
        );

        const destroyRequest = requestQueue.find(r =>
            !r.inProgress
            && destroyPair.includes(r.requestMethod)
            && this._getIdFromRequestTitle(request.title) === this._getIdFromRequestTitle(r.title)
        );

        if (optimizationRequest) {
            // MUST BE FIX
            requestQueue.push(request);
            dispatch(addRequest(request));

        } else if (destroyRequest) {
            dispatch(removeRequest(destroyRequest.requestId));
            requestQueue = requestQueue.filter(r => r.requestId !== destroyRequest.requestId);
        } else {
            requestQueue.push(request);
            dispatch(addRequest(request));
        }

        requestsStorage.setRequests(requestQueue);
    }

    static _addRequestToQueue(request: AppRequest, dispatch: ThunkDispatchType) {

        this._queryOptimizer(dispatch, request);

        // START ENGINE
        httpEngine.start(dispatch).then();
    }


    // ASYNC METHODS
    static getUser(dispatch: ThunkDispatchType, getState: () => RootStateType, userId: number) {
        const tabId = tabsStorage.getTabId();

        const title = this._requestTitleCreator('GET', 'user', userId);

        const requestConfig = new RequestConfig(
            HttpMethod.GET,
            'users',
            true,
            userId,
        );

        // CREATE ROLLBACK
        const state = getState();
        const rollbackState: ProfileRollback = getProfileData(state);
        const rollback = new Rollback(rollbackState);

        const request = new AppRequest(
            tabId,
            title,
            requestConfig,
            RequestMethod.GET_USER,
            rollback,
            true
        );

        // DO ACTION IN STATE before request
        BllAction[RequestMethod.GET_USER](dispatch);

        this._addRequestToQueue(request, dispatch);
    }

    static getUsers(dispatch: ThunkDispatchType, getState: () => RootStateType, count: number, page: number) {
        const tabId = tabsStorage.getTabId();

        const title = this._requestTitleCreator('GET', 'all-users');

        const requestConfig = new RequestConfig(
            HttpMethod.GET,
            'users',
            true,
            undefined,
            {count, page},
        );

        // CREATE ROLLBACK
        const state = getState();
        const rollbackState: UsersRollback = getFullUsers(state);
        const rollback = new Rollback(rollbackState);

        const request = new AppRequest(
            tabId,
            title,
            requestConfig,
            RequestMethod.GET_USERS,
            rollback,
            true
        );

        // DO ACTION IN STATE before request
        BllAction[RequestMethod.GET_USERS](dispatch);

        this._addRequestToQueue(request, dispatch);
    }

    static follow(dispatch: ThunkDispatchType, getState: () => RootStateType, userId: number) {

        const tabId = tabsStorage.getTabId();

        const title = this._requestTitleCreator('FOLLOW', 'user', userId);

        const requestConfig = new RequestConfig(
            HttpMethod.POST,
            'follow',
            true,
            userId
        );

        // CREATE ROLLBACK
        const rollbackState: FollowRollback = {userId, isFollowed: false};
        const rollback = new Rollback(rollbackState);

        const request = new AppRequest(
            tabId,
            title,
            requestConfig,
            RequestMethod.FOLLOW,
            rollback
        );

        // DO ACTION IN STATE before request
        BllAction[RequestMethod.FOLLOW](dispatch, userId);

        this._addRequestToQueue(request, dispatch);
    }

    static unFollow(dispatch: ThunkDispatchType, getState: () => RootStateType, userId: number) {

        const tabId = tabsStorage.getTabId();

        const title = this._requestTitleCreator('UNFOLLOW', 'user', userId);

        const requestConfig = new RequestConfig(
            HttpMethod.DELETE,
            'follow',
            true,
            userId
        );

        // CREATE ROLLBACK
        const rollbackState: FollowRollback = {userId, isFollowed: true};
        const rollback = new Rollback(rollbackState);

        const request = new AppRequest(
            tabId,
            title,
            requestConfig,
            RequestMethod.UNFOLLOW,
            rollback
        );

        // DO ACTION IN STATE before request
        BllAction[RequestMethod.UNFOLLOW](dispatch, userId);

        this._addRequestToQueue(request, dispatch);
    }

}