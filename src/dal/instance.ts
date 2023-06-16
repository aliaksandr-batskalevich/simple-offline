import axios, {AxiosRequestConfig} from 'axios';


// SERVER IP
const baseURL = 'http://35.239.107.150/api/simple-offline/';

const configs = [] as AxiosRequestConfig[];
let intervalId = null as null | NodeJS.Timer;

const axiosOptions = {
    baseURL,
};

const instance = axios.create(axiosOptions);

instance.interceptors.response.use(
    (config) => {

        // @ts-ignore
        if (config.config._isRepeated) {
            configs.shift();
        }

        return config
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.code === 'ERR_NETWORK' && !originalRequest._isRepeated) {

            originalRequest._isRepeated = true;
            configs.push(originalRequest);

            if (intervalId) return;

            intervalId = setInterval((configs) => {
                if (!configs.length) {
                    intervalId && clearInterval(intervalId);
                    intervalId = null;
                    return;
                }
                instance.request(configs[0]);
            }, 5000, configs);

            return;
        }

        // throw error;
    });

export default instance;