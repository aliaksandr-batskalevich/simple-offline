import {IUser} from "../IUser";

export interface AllUsersResponse {
    message: string
    data: {
        totalCount: number
        users: Array<IUser>
    }
}

export interface UserResponse {
    message: string
    data: {
        user: IUser
    }
}