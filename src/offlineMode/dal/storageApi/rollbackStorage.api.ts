import {StorageKeys} from "../../models/StorageTypes";
import {Rollback} from "../../models/Rollback";

class RollbackStorage {

    constructor() {
        this._initStorage();
    }

    _initStorage() {
        const rollbacksFromLS = localStorage.getItem(StorageKeys.ROLLBACKS);
        !rollbacksFromLS && localStorage.setItem(StorageKeys.ROLLBACKS, JSON.stringify([]));
    }

    public getAllRollbacks() {
        const localData = localStorage.getItem(StorageKeys.ROLLBACKS);
        if (!localData) return [] as Rollback[];

        return JSON.parse(localData) as Rollback[];
    }

    public addRollback(rollback: Rollback) {
        const allRollbacks = this.getAllRollbacks();

        allRollbacks.push(rollback);
        localStorage.setItem(StorageKeys.ROLLBACKS, JSON.stringify(allRollbacks));
    }

    public removeRollback(requestId: string) {
        let allRollbacks = this.getAllRollbacks();

        const rollback = allRollbacks.find(r => r.requestId === requestId);
        if (!rollback) return;

        allRollbacks = allRollbacks.filter(r => r.requestId !== requestId);
        localStorage.setItem(StorageKeys.ROLLBACKS, JSON.stringify(allRollbacks));
        return rollback;
    }

    public removeAllRollbacks() {
        localStorage.setItem(StorageKeys.ROLLBACKS, JSON.stringify([]));
    }

    public replaceRollbacks(currentTabId: string, targetTabId: string) {
        let allRollbacks = this.getAllRollbacks();
        allRollbacks.map(req => req.tabId === currentTabId ? req.tabId = targetTabId : req);
        localStorage.setItem(StorageKeys.ROLLBACKS, JSON.stringify(allRollbacks));
    }
}

export const rollbackStorage = new RollbackStorage();