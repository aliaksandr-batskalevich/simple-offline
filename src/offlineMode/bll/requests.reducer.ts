import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {httpEngine} from "../httpEngine";
import {RequestsQueueDAL} from "../dal/requestsQueue.dal";
import {AppRequest} from "../models/AppRequest";

export type RequestsActionsType = ReturnType<typeof addRequest>
    | ReturnType<typeof addRequests>
    | ReturnType<typeof removeRequest>
    | ReturnType<typeof removeAllRequests>;

enum RequestsActions {
    ADD_REQUEST = "ADD_REQUEST",
    ADD_REQUESTS = "ADD_REQUESTS",
    REMOVE_REQUEST = "REMOVE_REQUEST",
    REMOVE_ALL_REQUESTS = "REMOVE_ALL_REQUESTS",
}

interface RequestsStateType {
    requests: AppRequest[];
}

const requestsInitState: RequestsStateType = {
    requests: [],
};

export const requestsReducer = (state: RequestsStateType = requestsInitState, action: RequestsActionsType): RequestsStateType => {
    switch (action.type) {
        case RequestsActions.ADD_REQUESTS:
            return {...state, ...action.payload};
        case RequestsActions.ADD_REQUEST:
            return {...state, requests: [...state.requests, action.payload.request]};
        case RequestsActions.REMOVE_REQUEST:
            return {...state, requests: state.requests.filter(r => r.requestId !== action.payload.requestId)};
        case RequestsActions.REMOVE_ALL_REQUESTS:
            return {...state, requests: []};
        default:
            return state;
    }
};

const addRequests = (requests: AppRequest[]) => {
    return {
        type: RequestsActions.ADD_REQUESTS,
        payload: {requests}
    } as const;
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

export const startHttpEngineTC = () => (dispatch: ThunkDispatchType) => {
    const pr = httpEngine.start(dispatch);
};

export const replaceRequestsToNextTabTC = () => (dispatch: ThunkDispatchType) => {
    RequestsQueueDAL.replaceRequestsToNextTab();
};

export const importRequestsFromStorageTC = () => (dispatch: ThunkDispatchType) => {
    const requests = RequestsQueueDAL.getAllTabRequests();
    dispatch(addRequests(requests));
};

export const removeRequestTC = (requestId: string) => (dispatch: ThunkDispatchType) => {
    RequestsQueueDAL.removeRequest(requestId);
    dispatch(removeRequest(requestId));
};

export const removeAllTabRequestsTC = () => (dispatch: ThunkDispatchType) => {
    RequestsQueueDAL.removeAllTabRequests();
    dispatch(removeAllRequests());
};