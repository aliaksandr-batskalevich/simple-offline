export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export interface IRequest {
    method: Method,
    url: string,
    params?: string | number,
    queries?: {key: string, value: string | number},
    body?: any,
}