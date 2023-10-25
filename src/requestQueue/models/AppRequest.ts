import {v1} from "uuid";
import {RequestMethod} from "./RequestMethod";
import {Rollback} from "./Rollback";

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

export class AppRequest {
    requestId: string;
    tabId: string;
    title: string;
    dateCreate: string;
    requestConfig: RequestConfig;
    requestMethod: RequestMethod;
    rollback: Rollback;
    isPrimary: boolean;
    inProgress: boolean;

    constructor(
        tabId: string,
        title: string,
        requestConfig: RequestConfig,
        requestMethod: RequestMethod,
        rollback: Rollback,
        isPrimary: boolean = false,
    ) {
        this.requestId = v1();
        this.tabId = tabId;
        this.title = title;
        this.dateCreate = new Date().toLocaleTimeString();
        this.requestConfig = requestConfig;
        this.requestMethod = requestMethod;
        this.rollback = rollback;
        this.isPrimary = isPrimary;
        this.inProgress = false;
    }

}