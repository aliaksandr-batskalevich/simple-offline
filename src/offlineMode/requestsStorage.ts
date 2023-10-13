import {v1} from "uuid";
import {Request} from './requestCreator';

export enum StorageKeys {
    TAB_ID = 'tabId',                   // sessionStorage
    TABS = "tabs",                      // localStorage
    ENGINE_STATUS = "engineStatus",     // sessionStorage
    REQUESTS = "requests",              // localStorage
}

export enum EngineStatus {
    WAITING = "WAITING",
    PROGRESS = "PROGRESS",
}

type RequestQueue = Array<Request>;


class RequestsStorage {

    constructor() {
        this._initStorage();
    }

    _initStorage() {

        const tabId = v1();

        sessionStorage.setItem(StorageKeys.TAB_ID, tabId);

        const tabsFromLS = localStorage.getItem(StorageKeys.TABS);
        if (tabsFromLS) {
            const tabs = JSON.parse(tabsFromLS) as string[];
            tabs.push(tabId);
            localStorage.setItem(StorageKeys.TABS, JSON.stringify(tabs));
        } else {
            localStorage.setItem(StorageKeys.TABS, JSON.stringify([tabId]));
        }

        sessionStorage.setItem(StorageKeys.ENGINE_STATUS, EngineStatus.WAITING);

        const requestsFromLS = localStorage.getItem(StorageKeys.REQUESTS);
        !requestsFromLS && localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify([]));

    }

    public getTabId() {
        return sessionStorage.getItem(StorageKeys.TAB_ID) || 'no_tab_id';
    }

    public removeTabAndGetNext(tabId: string): string | undefined {
        const tabsFromLS = localStorage.getItem(StorageKeys.TABS);
        if (!tabsFromLS) return;

        let tabs = JSON.parse(tabsFromLS) as string[];
        tabs = tabs.filter(t => t !== tabId);
        localStorage.setItem(StorageKeys.TABS, JSON.stringify(tabs));

        return tabs[0];
    }

    public replaceRequests(currentTabId: string, targetTabId: string) {
        let allRequests = this.getAllRequests();
        allRequests.map(req => req.tabId === currentTabId ? req.tabId = targetTabId : req);
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify(allRequests));
    }

    public getEngineStatus() {
        return sessionStorage.getItem(StorageKeys.ENGINE_STATUS) || EngineStatus.WAITING;
    }

    public setEngineStatus(engineStatus: EngineStatus) {
        sessionStorage.setItem(StorageKeys.ENGINE_STATUS, engineStatus);
    }

    public getAllRequests() {
        const localData = localStorage.getItem(StorageKeys.REQUESTS);
        if (!localData) return [] as RequestQueue;

        return JSON.parse(localData) as RequestQueue;
    }

    public getAllTabRequests() {
        const tabId = this.getTabId();

        let requestQueue = this.getAllRequests();
        requestQueue = requestQueue.filter(r => r.tabId === tabId);

        return requestQueue;
    }

    public addRequest(request: Request): number | undefined {
        const requestQueue = this.getAllRequests();

        if (requestQueue.find(r => r.tabId === request.tabId && r.isPrimary)) return;

        const length = requestQueue.push(request);
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify(requestQueue));

        return length;
    }

    public removeRequest(requestId: string) {
        const localData = localStorage.getItem(StorageKeys.REQUESTS);
        if (!localData) return;

        let requestQueue = JSON.parse(localData) as RequestQueue;

        requestQueue = requestQueue.filter(r => r.requestId !== requestId);
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify(requestQueue));
    }

    public removeAllRequests() {
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify([]));
    }
}

export const requestsStorage = new RequestsStorage();