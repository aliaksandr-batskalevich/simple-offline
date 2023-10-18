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

    public addRequest(request: AppRequest): number | undefined {
        const requests = this.getAllRequests();

        // check primary requests
        if (requests.find(r => r.tabId === request.tabId && r.isPrimary)) return;

        const length = requests.push(request);
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify(requests));

        return length;
    }

    public removeRequest(requestId: string) {
        let requests = this.getAllRequests();
        const request = requests.find(r => r.requestId === requestId);
        if (!request) return;

        requests = requests.filter(r => r.requestId !== requestId);
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify(requests));
        return request;
    }

    public removeAllTabRequest(tabId: string) {
        let requests = this.getAllRequests();

        const allTabRequests = requests.filter(r => r.tabId === tabId);

        requests = requests.filter(r => r.tabId !== tabId);
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify(requests));
        return allTabRequests;
    }

    public removeAllRequests() {
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify([]));
    }

    public replaceRequests(currentTabId: string, targetTabId: string) {
        let allRequests = this.getAllRequests();
        allRequests.map(req => req.tabId === currentTabId ? req.tabId = targetTabId : req);
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify(allRequests));
    }
}

export const requestsStorage = new RequestsStorage();