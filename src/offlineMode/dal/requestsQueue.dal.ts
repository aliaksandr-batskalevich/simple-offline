import {HttpMethod, RequestConfig} from "../IAppRequest";
import {httpEngine} from "../httpEngine";
import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {AppRequest} from '../IAppRequest';
import {addSnackbarErrorMessage} from "../../bll/snackbar.reducer";
import {ResponseMethod} from "../responseActions";
import {requestsStorage} from "./requestsStorage.api";
import {tabsStorage} from "./tabsStorage.api";
import {addRequest} from "../bll/requests.reducer";

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
    }

    static removeAllTabRequests() {
        const tabId = tabsStorage.getTabId();
        requestsStorage.removeAllTabRequest(tabId);
    }

    static replaceRequestsToNextTab() {
        const tabId = tabsStorage.getTabId();
        const nextTabId = tabsStorage.removeTabAndGetNext(tabId);
        if (!nextTabId) return requestsStorage.removeAllRequests();

        requestsStorage.replaceRequests(tabId, nextTabId);
    }

    static async getUser(id: number, dispatch: ThunkDispatchType) {
        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.GET,
            'users',
            true,
            id
        );
        const responseMethod = ResponseMethod.SET_USER;

        const request = new AppRequest(tabId, 'GET USER', requestConfig, responseMethod, true);

        this._addRequestToQueue(request, dispatch);
    }

    static async getUsers(dispatch: ThunkDispatchType, count: number, page: number) {
        const tabId = tabsStorage.getTabId();

        const requestConfig = new RequestConfig(
            HttpMethod.GET,
            'users',
            true,
            undefined,
            {count, page},
        );
        const responseMethod = ResponseMethod.SET_USERS;

        const request = new AppRequest(tabId, 'GET ALL USERS', requestConfig, responseMethod, true);

        this._addRequestToQueue(request, dispatch);
    }

}