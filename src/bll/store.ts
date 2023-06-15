import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import thunkMiddleware from 'redux-thunk';
import {ProfileActionsType, profileReducer} from "./profile.reducer";
import {SnackbarActionsType, snackbarReducer} from "./snackbar.reducer";
import {UserActionsType, usersReducer} from "./users.reducer";

export type RootStateType = ReturnType<typeof rootReducer>;
export type RootActionsType = ProfileActionsType | SnackbarActionsType | UserActionsType;

const rootReducer = combineReducers({
    profile: profileReducer,
    users: usersReducer,
    snackbar: snackbarReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.appStore = store;