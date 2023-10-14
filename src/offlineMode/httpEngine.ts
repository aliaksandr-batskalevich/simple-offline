import axios from "axios";
import {ResponseActions, ResponseMethod} from "./responseActions";
import {ThunkDispatchType} from "../utils/hooks/useAppDispatch";
import {engineStorage} from "./dal/engineStorage.api";
import {requestsStorage} from "./dal/requestsStorage.api";
import {EngineStatus} from "./dal/StorageTypes";
import {tabsStorage} from "./dal/tabsStorage.api";
import {removeRequest} from "./bll/requests.reducer";

const baseURL = 'http://185.250.46.14/api/simple-offline/';

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
            const responseMethod = request.responseMethod as ResponseMethod;

            try {
                const response = await this._instance.request(requestConfig);
                // @ts-ignore
                ResponseActions[responseMethod](response.data, dispatch);
                requestsStorage.removeRequest(request.requestId);
                dispatch(removeRequest(request.requestId));

            } catch (e) {

                // ERROR PROCESSING - MUST BE FIX
                break;
            }

        }

        engineStorage.setEngineStatus(EngineStatus.WAITING);
    }

}

export const httpEngine = new HttpEngine();