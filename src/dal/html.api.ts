import instance from "./instance";
import {AllUsersResponse, UserResponse} from "../models/users.response";

export class UsersAPI {

    static async getUser(id: number): Promise<UserResponse> {
        return instance.get<UserResponse>(`users/${id}`)
            .then(response => response.data);
    }

    static async getUsers(count: number, page: number): Promise<AllUsersResponse> {
        return instance.get<AllUsersResponse>(`users?count=${count}&page=${page}`)
            .then(response => response.data);
    }

}

// export class FollowAPI {
//
//     static async follow(id: number): Promise<FollowResponse> {
//         return instance.post<FollowResponse>(`follow/${id}`)
//             .then(response => response.data);
//     }
//
//     static async unFollow(id: number): Promise<FollowResponse> {
//         return instance.delete<FollowResponse>(`follow/${id}`)
//             .then(response => response.data);
//     }
//
// }