import {authInstance} from "./authInstance";


// export class AuthDAL {
//
//     static async getUser(id: number): Promise<UserResponse> {
//         return authInstance.get<UserResponse>(`users/${id}`)
//             .then(response => response.data);
//     }
//
//     static async getUsers(count: number, page: number): Promise<AllUsersResponse> {
//         return authInstance.get<AllUsersResponse>(`users?count=${count}&page=${page}`)
//             .then(response => response.data);
//     }
//
// }