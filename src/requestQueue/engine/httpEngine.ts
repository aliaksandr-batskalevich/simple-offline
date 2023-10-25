import axios from "axios";
import {ResponseResolveAction} from "../actions/responseResolve.action";
import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {engineStorage} from "../dal/storageApi/engineStorage.api";
import {requestsStorage} from "../dal/storageApi/requestsStorage.api";
import {EngineStatus} from "../models/StorageTypes";
import {tabsStorage} from "../dal/storageApi/tabsStorage.api";
import {removeRequest} from "../bll/requests.reducer";
import {RequestMethod} from "../models/RequestMethod";
import {ResponseRejectAction} from "../actions/responseReject.action";

const baseURL = process.env.REACT_APP_SERVER_ENDPOINT || 'http://185.250.46.14/api/simple-offline/';

class HttpEngine {
    _instance;

    constructor() {
        this._instance = axios.create({baseURL});
    }

    public async start(dispatch: ThunkDispatchType) {

        const engineStatus = engineStorage.getEngineStatus();
        if (engineStatus === EngineStatus.PROGRESS) return;

        engineStorage.setEngineStatus(EngineStatus.PROGRESS);

        const tabId = tabsStorage.getTabId();
        let allTabRequests = requestsStorage.getAllTabRequests(tabId);

        for (let i = 0; i < allTabRequests.length; allTabRequests = requestsStorage.getAllTabRequests(tabId)) {
            if (!window.navigator.onLine) break;

            const request = allTabRequests[0];
            requestsStorage.changeRequestProgress(request.requestId, true);

            const requestConfig = request.requestConfig;
            const requestMethod = request.requestMethod as RequestMethod;

            try {
                const response = await this._instance.request(requestConfig);

                const responseResolveAction = ResponseResolveAction[requestMethod];
                if (!responseResolveAction) continue;

                responseResolveAction(response.data, dispatch);

            } catch (e) {
                // ERROR PROCESSING - MUST BE FIX

                const responseRejectAction = ResponseRejectAction[requestMethod];
                if (!responseRejectAction) continue;

                responseRejectAction(request.rollback.payload, dispatch);
            }

            requestsStorage.removeRequest(request.requestId);
            dispatch(removeRequest(request.requestId));

        }

        engineStorage.setEngineStatus(EngineStatus.WAITING);
    }
}

export const httpEngine = new HttpEngine();