import axios, {AxiosRequestConfig} from 'axios';


// SERVER IP
const baseURL = 'http://185.250.46.14/api/simple-offline/';
const controller = new AbortController();

const configs = [] as AxiosRequestConfig[];
let superConfig: null | AxiosRequestConfig = null;
let intervalId = null as null | NodeJS.Timer;

const axiosOptions = {
    baseURL,
    signal: controller.signal,
};

const instance = axios.create(axiosOptions);

export const letsGo = () => {
    // configs.forEach(async config => {
    //    await instance.request(config);
    // });
    superConfig && instance.request(superConfig);
};

instance.interceptors.request.use((config) => {

    if (!window.navigator.onLine) {
        // configs.push(config);
        superConfig = config;
        // controller.abort('Offline mode.');
    }

    return config;
})

instance.interceptors.response.use(
    (config) => {

        // @ts-ignore
        if (config.config._isRepeated) {
            configs.shift();
        }

        return config
    },
    // async (error) => {
    //     const originalRequest = error.config;
    //
    //     if (error.code === 'ERR_NETWORK' && !originalRequest._isRepeated) {
    //
    //         originalRequest._isRepeated = true;
    //         configs.push(originalRequest);
    //
    //         if (intervalId) return;
    //
    //         intervalId = setInterval((configs) => {
    //             if (!configs.length) {
    //                 intervalId && clearInterval(intervalId);
    //                 intervalId = null;
    //                 return;
    //             }
    //             instance.request(configs[0]);
    //         }, 5000, configs);
    //
    //         return;
    //     }
    //
    //     // throw error;
    // }
    );

export default instance;