import axios from "axios";
import {EngineStatus, requestsStorage} from "./requestsStorage";
import {ResponseActions, ResponseMethod} from "./responseActions";
import {ThunkDispatchType} from "../utils/hooks/useAppDispatch";

const baseURL = 'http://185.250.46.14/api/simple-offline/';

class EngineAPI {
    _instance;

    constructor() {
        this._instance = axios.create({baseURL});
    }

    public async engine(dispatch: ThunkDispatchType) {

        const engineStatus = requestsStorage.getEngineStatus();
        if (engineStatus === EngineStatus.PROGRESS) return;

        requestsStorage.setEngineStatus(EngineStatus.PROGRESS);

        let allTabRequests = requestsStorage.getAllTabRequests();

        for (let i = 0; i < allTabRequests.length; allTabRequests = requestsStorage.getAllTabRequests()) {
            if (!window.navigator.onLine) break;

            const request = allTabRequests[0];
            const requestConfig = request.requestConfig;
            const responseMethod = request.responseMethod as ResponseMethod;

            try {
                const response = await this._instance.request(requestConfig);
                // @ts-ignore
                ResponseActions[responseMethod](response.data, dispatch);
                requestsStorage.removeRequest(request.requestId);

            } catch (e) {

                // ERROR PROCESSING - MUST BE FIX
                break;
            }

        }

        requestsStorage.setEngineStatus(EngineStatus.WAITING);
    }

}

export const engineAPI = new EngineAPI();