
export enum StorageKeys {
    TAB_ID = "tabId",                   // sessionStorage
    TABS = "tabs",                      // localStorage
    ENGINE_STATUS = "engineStatus",     // sessionStorage
    REQUESTS = "requests",              // localStorage
    ROLLBACKS = "rollbacks",            // localStorage
}

export enum EngineStatus {
    WAITING = "WAITING",
    PROGRESS = "PROGRESS",
}