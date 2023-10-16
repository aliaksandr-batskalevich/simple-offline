import axios from "axios";
import {ResponseResolveAction} from "./actions/responseResolve.action";
import {ThunkDispatchType} from "../utils/hooks/useAppDispatch";
import {engineStorage} from "./dal/storageApi/engineStorage.api";
import {requestsStorage} from "./dal/storageApi/requestsStorage.api";
import {EngineStatus} from "./models/StorageTypes";
import {tabsStorage} from "./dal/storageApi/tabsStorage.api";
import {removeRequest} from "./bll/requests.reducer";
import {RequestMethod} from "./models/RequestMethod";
import {ResponseRejectAction} from "./actions/responseReject.action";
import {rollbackStorage} from "./dal/storageApi/rollbackStorage.api";
import {addSnackbarErrorMessage} from "../bll/snackbar.reducer";

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
            const requestConfig = request.requestConfig;
            const responseMethod = request.responseMethod as RequestMethod;

            try {
                const response = await this._instance.request(requestConfig);
                // @ts-ignore
                ResponseResolveAction[responseMethod](response.data, dispatch);
                requestsStorage.removeRequest(request.requestId);
                rollbackStorage.removeRollback(request.requestId);
                dispatch(removeRequest(request.requestId));

            } catch (e) {
                // ERROR PROCESSING - MUST BE FIX

                requestsStorage.removeRequest(request.requestId);

                const rollbackData = rollbackStorage.getRollback(request.requestId);
                if (!rollbackData) {
                    dispatch(addSnackbarErrorMessage('Request rejected, rollback not found!'));
                    return;
                }

                // @ts-ignore
                ResponseRejectAction[responseMethod](rollbackData.statePart, dispatch);

                rollbackStorage.removeRollback(request.requestId);

                // break;
            }
        }

        engineStorage.setEngineStatus(EngineStatus.WAITING);
    }
}

export const httpEngine = new HttpEngine();