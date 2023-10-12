import {v1} from "uuid";
import {Request} from './requestCreator';

enum StorageKeys {
    TAB_ID = 'tabId',                   // sessionStorage
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
        sessionStorage.setItem(StorageKeys.TAB_ID, v1());
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify([]));
        sessionStorage.setItem(StorageKeys.ENGINE_STATUS, EngineStatus.WAITING);
    }

    public getTabId() {
        return sessionStorage.getItem(StorageKeys.TAB_ID) || 'no_tab_id';
    }

    public getEngineStatus() {
        return sessionStorage.getItem(StorageKeys.ENGINE_STATUS) || EngineStatus.WAITING;
    }

    public setEngineStatus(engineStatus: EngineStatus) {
        sessionStorage.setItem(StorageKeys.ENGINE_STATUS, engineStatus);
    }

    public addRequest(request: Request): number | undefined {
        const localData = localStorage.getItem(StorageKeys.REQUESTS);
        if (!localData) return;

        const requestQueue = JSON.parse(localData) as RequestQueue;
        if (requestQueue.find(r => r.isPrimary)) return;

        const length = requestQueue.push(request);
        localStorage.setItem(StorageKeys.REQUESTS, JSON.stringify(requestQueue));

        return length;
    }

    public getAllTabRequests() {
        const localData = localStorage.getItem(StorageKeys.REQUESTS);
        if (!localData) return [] as RequestQueue;

        const tabId = this.getTabId();

        let requestQueue = JSON.parse(localData) as RequestQueue;
        requestQueue = requestQueue.filter(r => r.tabId === tabId);

        return  requestQueue;
    }


    public removeRequest(requestId: string) {
        const localData = localStorage.getItem(StorageKeys.REQUESTS);
        if (!localData) return;

        let requestQueue = JSON.parse(localData) as RequestQueue;

        requestQueue = requestQueue.filter(r => r.requestId !== requestId);
        localStorage.setItem('requests', JSON.stringify(requestQueue));
    }

    public removeAllRequests() {
        this._initStorage.call(this);
    }
}

export const requestsStorage = new RequestsStorage();