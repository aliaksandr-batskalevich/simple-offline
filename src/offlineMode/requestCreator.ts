import {requestsStorage} from "./requestsStorage";
import {ResponseMethod} from "./responseActions";
import {v1} from "uuid";

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export class RequestConfig {
    method: HttpMethod;
    url: string;
    withCredentials?: boolean;
    params?: Record<string, string | number>;
    data?: any;

    constructor(
        httpMethod: HttpMethod,
        url: string,
        withCredentials?: boolean,
        params?: string | number,
        queryParams?: Record<string, string | number>,
        body?: any
    ) {
        this.method = httpMethod;
        this.url = url;
        this.withCredentials = withCredentials;
        if (params) this.url = this.url.concat(`/${params}`);
        this.params = queryParams;
        this.data = body;
    }
}

export class Request {
    requestId: string;
    tabId: string;
    title: string;
    dateCreate: string;
    requestConfig: RequestConfig;
    responseMethod: ResponseMethod;
    isPrimary: boolean;

    constructor(
        title: string,
        requestConfig: RequestConfig,
        responseMethod: ResponseMethod,
        isPrimary: boolean = false
    ) {
        this.requestId = v1();
        this.tabId = requestsStorage.getTabId();
        this.title = title;
        this.dateCreate = new Date().toLocaleTimeString();
        this.requestConfig = requestConfig;
        this.responseMethod = responseMethod;
        this.isPrimary = isPrimary;
    }

}