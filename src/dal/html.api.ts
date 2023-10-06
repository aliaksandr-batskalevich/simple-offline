import instance from "./instance";
import {AllUsersResponse, UserResponse} from "../models/users.response";
import {FollowResponse} from "../models/follow.response";
import {AxiosRequestConfig} from "axios";
import {IRequest, Method} from "../models/IRequest";

const requests: IRequest[] = [];
let isActive = false;

const letsGo = async () => {
    for (let i = 0; i < requests.length; i++) {
        await instance.request(requests[i]);
    }
    isActive = false;
};

const requestCreator = ({method, url, params, queries, body}: IRequest): AxiosRequestConfig => {
    const request: AxiosRequestConfig = {
        method,
        url: `${url}/${params}`,
    };
    if (queries) {
        request.params = queries;
    }
    if (body) {
        request.data = body;
    }

    return request;
};

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

export class FollowAPI {

    static followCustom(id: number) {
        const request = {method: Method.POST, url: 'follow', params: id};
        requests.push(request);

        if (!isActive) {
            isActive = true;
            letsGo();
        }
    };

    static async follow(id: number): Promise<FollowResponse> {
        return instance.post<FollowResponse>(`follow/${id}`)
            .then(response => {
                if (!response) {
                    return Promise.reject({message: 'Offline mode!'});
                }

                return response.data;
            });
    };

    static async unFollow(id: number): Promise<FollowResponse> {
        return instance.delete<FollowResponse>(`follow/${id}`)
            .then(response => {
                if (!response) {
                    return Promise.reject({message: 'Offline mode!'});
                }

                return response.data;
            });
    };

}