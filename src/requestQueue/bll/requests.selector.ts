import {RootStateType} from "../../bll/store";
import {AppRequest} from "../models/AppRequest";

export const getRequests = (state: RootStateType): AppRequest[] => state.requests.requests;