import {IUser} from "./IUser";

export interface FollowResponse {
    message: string
    data: {
        user: IUser
    }
}