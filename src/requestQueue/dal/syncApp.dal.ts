import {ThunkDispatchType} from "../../utils/hooks/useAppDispatch";
import {requestsStorage} from "./storageApi/requestsStorage.api";
import {tabsStorage} from "./storageApi/tabsStorage.api";
import {rollbackStorage} from "./storageApi/rollbackStorage.api";
import {RollbackAction} from "../actions/rollback.action";

export class SyncAppDAL {

    static getTabId() {
        return  tabsStorage.getTabId();
    }

    static removeRequestWithRollback(requestId: string, dispatch: ThunkDispatchType) {
        const request = requestsStorage.removeRequest(requestId);
        if (!request) return;

        // ROLLBACK APP DATA
        // get rollbackData and REMOVE it from storage
        const rollbackAction = RollbackAction[request.requestMethod];
        const rollback = rollbackStorage.removeRollback(requestId);
        if (!rollbackAction || !rollback) return;

        rollbackAction(rollback.statePart, dispatch);
    }

    static removeAllTabRequestsWithRollback(dispatch: ThunkDispatchType) {
        const tabId = tabsStorage.getTabId();
        const allTabRequests = requestsStorage.removeAllTabRequest(tabId);

        // ROLLBACK APP DATA
        allTabRequests.forEach(r => {
            const rollbackAction = RollbackAction[r.requestMethod];
            const rollback = rollbackStorage.removeRollback(r.requestId);
            if (!rollbackAction || !rollback) return;

            rollbackAction(rollback.statePart, dispatch);
        });
    }

    static replaceRequestsToNextTab() {
        const currentTabId = tabsStorage.getTabId();
        const targetTabId = tabsStorage.removeTabAndGetNext(currentTabId);
        if (!targetTabId) {
            requestsStorage.removeAllRequests();
            rollbackStorage.removeAllRollbacks();
            return;
        }

        requestsStorage.replaceRequests(currentTabId, targetTabId);
        rollbackStorage.replaceRollbacks(currentTabId, targetTabId);

        return {currentTabId, targetTabId};
    }

}