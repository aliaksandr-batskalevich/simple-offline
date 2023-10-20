import {v1} from "uuid";
import {StorageKeys} from "../../models/StorageTypes";

class TabsStorage {

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
}

export const tabsStorage = new TabsStorage();