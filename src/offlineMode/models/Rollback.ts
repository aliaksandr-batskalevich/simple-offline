export class Rollback {
    tabId: string;
    requestId: string;
    statePart: any;

    constructor(
        tabId: string,
        requestId: string,
        statePart: any,
    ) {
        this.tabId = tabId;
        this.requestId = requestId;
        this.statePart = statePart;
    }
}