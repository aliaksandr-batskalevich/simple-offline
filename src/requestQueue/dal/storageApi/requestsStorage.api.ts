import {AppRequest} from '../../models/AppRequest';
import {StorageKeys} from "../../models/StorageTypes";

class RequestsStorage {

    constructor() {
        this._initStorage();
    }

    _initStorage() {
        const requestsFromLS = localStorage.getItem(StorageKeys.REQUESTS);
        !requestsFromLS && localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify([]));
    }

    public getAllRequests() {
        const localData = localStorage.getItem(StorageKeys.REQUESTS);
        if (!localData) return [] as AppRequest[];

        return JSON.parse(localData) as AppRequest[];
    }

    public getAllTabRequests(tabId: string) {

        let requests = this.getAllRequests();
        requests = requests.filter(r => r.tabId === tabId);

        return requests;
    }

    public setRequests(requests: AppRequest[]) {
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify(requests));
    }

    public removeRequest(requestId: string) {
        let requests = this.getAllRequests();
        const request = requests.find(r => r.requestId === requestId);
        if (!request) return;

        requests = requests.filter(r => r.requestId !== requestId);
        this.setRequests(requests);
        return request;
    }

    public removeAllTabRequest(tabId: string) {
        let requests = this.getAllRequests();

        const allTabRequests = requests.filter(r => r.tabId === tabId);

        requests = requests.filter(r => r.tabId !== tabId);
        this.setRequests(requests);
        return allTabRequests;
    }

    public removeAllRequests() {
        this.setRequests([]);
    }

    public replaceRequests(currentTabId: string, targetTabId: string) {
        let requests = this.getAllRequests();
        requests.map(req => req.tabId === currentTabId ? req.tabId = targetTabId : req);
        this.setRequests(requests);
    }

    public changeRequestProgress(requestId: string, inProgress: boolean) {
        let requests = this.getAllRequests();
        requests = requests.map(r => r.requestId === requestId ? {...r, inProgress} : r);
        this.setRequests(requests);
    }
}

export const requestsStorage = new RequestsStorage();