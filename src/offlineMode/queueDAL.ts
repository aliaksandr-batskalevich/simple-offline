import {HttpMethod, Request, RequestConfig} from "./requestCreator";
import {ResponseMethod} from "./responseActions";
import {requestsStorage} from "./requestsStorage";
import {addSnackbarErrorMessage} from "../bll/snackbar.reducer";
import {engineAPI} from "./engineAPI";
import {ThunkDispatchType} from "../utils/hooks/useAppDispatch";

export class QueueDAL {

    static async getUser(id: number, dispatch: ThunkDispatchType) {
        const requestConfig = new RequestConfig(HttpMethod.GET, 'users', true, id);
        const responseMethod = ResponseMethod.SET_USER;

        const request = new Request('GET USER', requestConfig, responseMethod, true);

        const length = requestsStorage.addRequest(request);
        if (!length) return dispatch(addSnackbarErrorMessage('Offline mode blocked by primary request!'))

        // START ENGINE
        const pr = engineAPI.engine(dispatch);
    }

    static async getUsers(dispatch: ThunkDispatchType, count: number, page: number) {
        const requestConfig = new RequestConfig(
            HttpMethod.GET,
            'users',
            true,
            undefined,
            {count, page},
        );
        const responseMethod = ResponseMethod.SET_USERS;

        const request = new Request('GET ALl USERS', requestConfig, responseMethod, true);

        const length = requestsStorage.addRequest(request);
        if (!length) return dispatch(addSnackbarErrorMessage('Offline mode blocked by primary request!'))

        // START ENGINE
        const pr = engineAPI.engine(dispatch);
    }

}