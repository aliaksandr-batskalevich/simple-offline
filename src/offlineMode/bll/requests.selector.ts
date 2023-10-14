import {RootStateType} from "../../bll/store";
import {AppRequest} from "../IAppRequest";

export const getRequests = (state: RootStateType): AppRequest[] => state.requests.requests;