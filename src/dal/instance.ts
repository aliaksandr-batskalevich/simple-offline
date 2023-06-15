import axios from 'axios';

// SERVER IP
const baseURL = 'http://35.239.107.150/api/simple-offline/';

const axiosOptions = {
    baseURL,
};

const instance = axios.create(axiosOptions);

instance.interceptors.request.use((config) => {
    // const accessToken = readAccessTokenInLS();
    // config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

instance.interceptors.response.use(
    (config) => {
        console.log(config);

        return config
    },
    async (error) => {
        throw error;
    });

export default instance;