import {EngineStatus, StorageKeys} from "../../models/StorageTypes";

class EngineStorage {

    constructor() {
        this._initStorage();
    }

    _initStorage() {
        sessionStorage.setItem(StorageKeys.ENGINE_STATUS, EngineStatus.WAITING);
    }

    public getEngineStatus() {
        return sessionStorage.getItem(StorageKeys.ENGINE_STATUS) || EngineStatus.WAITING;
    }

    public setEngineStatus(engineStatus: EngineStatus) {
        sessionStorage.setItem(StorageKeys.ENGINE_STATUS, engineStatus);
    }
}

export const engineStorage = new EngineStorage();