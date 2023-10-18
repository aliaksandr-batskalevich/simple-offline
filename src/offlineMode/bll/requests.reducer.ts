import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {httpEngine} from "../httpEngine";
import {RequestsQueueDAL} from "../dal/requestsQueue.dal";
import {AppRequest} from "../models/AppRequest";

export type RequestsActionsType = ReturnType<typeof addRequest>
    | ReturnType<typeof removeRequest>
    | ReturnType<typeof removeAllRequests>
    | ReturnType<typeof replaceRequestsToNextTab>;

enum RequestsActions {
    ADD_REQUEST = "ADD_REQUEST",
    REMOVE_REQUEST = "REMOVE_REQUEST",
    REMOVE_ALL_REQUESTS = "REMOVE_ALL_REQUESTS",
    REPLACE_REQUESTS_TO_NEXT_TAB = "REPLACE_REQUESTS_TO_NEXT_TAB",
}

interface RequestsStateType {
    requests: AppRequest[];
}

const requestsInitState: RequestsStateType = {
    requests: [],
};

export const requestsReducer = (state: RequestsStateType = requestsInitState, action: RequestsActionsType): RequestsStateType => {
    switch (action.type) {
        case RequestsActions.ADD_REQUEST:
            return {...state, requests: [...state.requests, action.payload.request]};
        case RequestsActions.REMOVE_REQUEST:
            return {...state, requests: state.requests.filter(r => r.requestId !== action.payload.requestId)};
        case RequestsActions.REMOVE_ALL_REQUESTS:
            return {...state, requests: []};
        case RequestsActions.REPLACE_REQUESTS_TO_NEXT_TAB:
            return {
                ...state,
                requests: state.requests
                    .map(r => r.tabId === action.payload.currentTabId
                        ? {...r, tabId: action.payload.targetTabId}
                        : r),
            };
        default:
            return state;
    }
};

export const addRequest = (request: AppRequest) => {
    return {
        type: RequestsActions.ADD_REQUEST,
        payload: {request}
    } as const;
};

export const removeRequest = (requestId: string) => {
    return {
        type: RequestsActions.REMOVE_REQUEST,
        payload: {requestId}
    } as const;
};

const removeAllRequests = () => {
    return {
        type: RequestsActions.REMOVE_ALL_REQUESTS
    } as const;
};

const replaceRequestsToNextTab = (currentTabId: string, targetTabId: string) => {
    return {
        type: RequestsActions.REPLACE_REQUESTS_TO_NEXT_TAB,
        payload: {currentTabId, targetTabId}
    } as const;
};


export const startHttpEngineTC = () => (dispatch: ThunkDispatchType) => {
    const pr = httpEngine.start(dispatch);
};

export const removeRequestTC = (requestId: string) => (dispatch: ThunkDispatchType) => {
    RequestsQueueDAL.removeRequestWithRollback(requestId, dispatch);
    dispatch(removeRequest(requestId));
};

export const removeAllTabRequestsTC = () => (dispatch: ThunkDispatchType) => {
    RequestsQueueDAL.removeAllTabRequestsWithRollback(dispatch);
    dispatch(removeAllRequests());
};

export const replaceRequestsToNextTabTC = () => (dispatch: ThunkDispatchType) => {
    const result = RequestsQueueDAL.replaceRequestsToNextTab();
    if (!result) return;

    dispatch(replaceRequestsToNextTab(result.currentTabId, result.targetTabId));
};