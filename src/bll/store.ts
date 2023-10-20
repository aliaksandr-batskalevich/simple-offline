import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import thunkMiddleware from 'redux-thunk';
import {ProfileActionsType, profileReducer} from "./profile.reducer";
import {SnackbarActionsType, snackbarReducer} from "./snackbar.reducer";
import {UserActionsType, usersReducer} from "./users.reducer";
import {AppActionsType, appReducer} from "./app.reducer";
import {RequestsActionsType, requestsReducer} from "../requestQueue/bll/requests.reducer";

import {
    createStateSyncMiddleware,
    initMessageListener,
} from "redux-state-sync";

export type RootStateType = ReturnType<typeof rootReducer>;
export type RootActionsType = AppActionsType
    | ProfileActionsType
    | SnackbarActionsType
    | UserActionsType
    | RequestsActionsType;

const rootReducer = combineReducers({
    app: appReducer,
    profile: profileReducer,
    users: usersReducer,
    snackbar: snackbarReducer,
    requests: requestsReducer,
});

const stateSyncMiddleware = createStateSyncMiddleware();

export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware, stateSyncMiddleware));

initMessageListener(store);

// @ts-ignore
window.appStore = store;