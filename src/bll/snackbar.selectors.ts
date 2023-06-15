import {SnackbarMessageType} from "./snackbar.reducer";
import {RootStateType} from "./store";

export const getSnackbarMessages = (state: RootStateType): Array<SnackbarMessageType> => state.snackbar.snackbarMessages;