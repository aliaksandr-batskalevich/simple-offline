import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import thunkMiddleware from 'redux-thunk';
import {ProfileActionsType, profileReducer} from "./profile.reducer";
import {SnackbarActionsType, snackbarReducer} from "./snackbar.reducer";
import {UserActionsType, usersReducer} from "./users.reducer";
import {AppActionsType, appReducer} from "./app.reducer";
import {RequestsActionsType, requestsReducer} from "../offlineMode/bll/requests.reducer";

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

export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.appStore = store;