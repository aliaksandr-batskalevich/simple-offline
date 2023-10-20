enum AppActionType {
    SET_CONNECTION_STATUS = "SET_CONNECTION_STATUS",
    SET_IS_APP_INIT = "SET_IS_APP_INIT",
}

export type AppActionsType = ReturnType<typeof setIsOnline>
    | ReturnType<typeof setIsAppInit>;

export type AppStateType = {
    isOnline: boolean
    isAppInit: boolean
};

const appInitState: AppStateType = {
    isOnline: true,
    isAppInit: false,
};


export const appReducer = (state: AppStateType = appInitState, action: AppActionsType): AppStateType => {
    switch (action.type) {
        case AppActionType.SET_CONNECTION_STATUS:
        case AppActionType.SET_IS_APP_INIT:
            return {...state, ...action.payload};
        default:
            return state;
    }
};

export const setIsOnline = (isOnline: boolean) => {
    return {
        type: AppActionType.SET_CONNECTION_STATUS,
        payload: {isOnline}
    } as const;
};

export const setIsAppInit = (isAppInit: boolean) => {
    return {
        type: AppActionType.SET_IS_APP_INIT,
        payload: {isAppInit}
    } as const;
};