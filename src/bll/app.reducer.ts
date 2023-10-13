enum AppActionType {
    SET_CONNECTION = "SET_CONNECTION",
    SET_REQUESTS_UPDATE = "SET_REQUESTS_UPDATE",
}

export type AppActionsType = ReturnType<typeof setIsOnline>;

export type AppStateType = {
    isOnline: boolean
};

const appInitState: AppStateType = {
    isOnline: true,
};


export const appReducer = (state: AppStateType = appInitState, action: AppActionsType): AppStateType => {
    switch (action.type) {
        case AppActionType.SET_CONNECTION:
            return {...state, ...action.payload};
        default:
            return state;
    }
};

export const setIsOnline = (isOnline: boolean) => {
    return {
        type: AppActionType.SET_CONNECTION,
        payload: {isOnline}
    } as const;
};