import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {requestsStorage} from "./storageApi/requestsStorage.api";
import {tabsStorage} from "./storageApi/tabsStorage.api";
import {RollbackAction} from "../actions/rollback.action";

export class SyncAppDAL {

    static getTabId() {
        return  tabsStorage.getTabId();
    }

    static removeRequest(requestId: string, dispatch: ThunkDispatchType) {
        const request = requestsStorage.removeRequest(requestId);
        if (!request) return;

        // ROLLBACK APP DATA
        const rollbackAction = RollbackAction[request.requestMethod];
        if (!rollbackAction) return;

        rollbackAction(request.rollback.payload, dispatch);
    }

    static removeAllTabRequests(tabId: string, dispatch: ThunkDispatchType) {
        const allTabRequests = requestsStorage.removeAllTabRequest(tabId);

        // ROLLBACK APP DATA
        allTabRequests.forEach(r => {
            const rollbackAction = RollbackAction[r.requestMethod];
            if (!rollbackAction) return;

            rollbackAction(r.rollback.payload, dispatch);
        });
    }

    static replaceRequestsToNextTab() {
        const currentTabId = tabsStorage.getTabId();
        const targetTabId = tabsStorage.removeTabAndGetNext(currentTabId);
        if (!targetTabId) {
            requestsStorage.removeAllRequests();
            return;
        }

        requestsStorage.replaceRequests(currentTabId, targetTabId);

        return {currentTabId, targetTabId};
    }

}