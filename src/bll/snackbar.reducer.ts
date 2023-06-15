import {v1} from "uuid";

export type SnackbarActionsType = ReturnType<typeof addSnackbarErrorMessage>
    | ReturnType<typeof addSnackbarWarningMessage>
    | ReturnType<typeof addSnackbarInfoMessage>
    | ReturnType<typeof removeSnackbarMessage>;

export enum SnackbarMessageTextType {
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning'
}
export type SnackbarMessageType = {
    id: string
    type: SnackbarMessageTextType
    text: string
};
type SnackBarStateType = {
    snackbarMessages: Array<SnackbarMessageType>,
};

const snackbarInitState: SnackBarStateType = {
    snackbarMessages: [] as Array<SnackbarMessageType>,
};

export const snackbarReducer = (state: SnackBarStateType = snackbarInitState, action: SnackbarActionsType): SnackBarStateType => {
    switch (action.type) {
        case 'ADD_SNACKBAR_ERROR_MESSAGE':
            return {...state, snackbarMessages: [{type: SnackbarMessageTextType.ERROR, id: v1(), ...action.payload}, ...state.snackbarMessages]};
        case 'ADD_SNACKBAR_WARNING_MESSAGE':
            return {...state, snackbarMessages: [{type: SnackbarMessageTextType.WARNING, id: v1(), ...action.payload}, ...state.snackbarMessages]};
        case 'ADD_SNACKBAR_INFO_MESSAGE':
            return {...state, snackbarMessages: [{type: SnackbarMessageTextType.INFO, id: v1(), ...action.payload}, ...state.snackbarMessages]};
        case 'REMOVE_SNACKBAR_MESSAGE':
            return {...state, snackbarMessages: state.snackbarMessages.filter(m => m.id !== action.payload.id)};
        default:
            return state;
    }
};

export const addSnackbarErrorMessage = (text: string) => {
    return {
        type: 'ADD_SNACKBAR_ERROR_MESSAGE',
        payload: {text}
    } as const;
};
export const addSnackbarWarningMessage = (text: string) => {
    return {
        type: 'ADD_SNACKBAR_WARNING_MESSAGE',
        payload: {text}
    } as const;
};
export const addSnackbarInfoMessage = (text: string) => {
    return {
        type: 'ADD_SNACKBAR_INFO_MESSAGE',
        payload: {text}
    } as const;
};
export const removeSnackbarMessage = (id: string) => {
    return {
        type: 'REMOVE_SNACKBAR_MESSAGE',
        payload: {id}
    } as const;
};